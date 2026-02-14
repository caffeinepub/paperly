import Map "mo:core/Map";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import PaperId "mo:core/Nat";
import Runtime "mo:core/Runtime";
import List "mo:core/List";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Migration "migration";

(with migration = Migration.run)
actor {
  // QUESTION PAPERS

  // Types
  public type Question = {
    text : Text;
    options : [Text];
    correctAnswer : Nat;
    marks : Nat;
    difficulty : Difficulty;
  };

  public type Difficulty = {
    #easy;
    #medium;
    #hard;
  };

  public type PaperMetaData = {
    title : Text;
    subject : Text;
    grade : Text;
    creator : Principal;
  };

  public type QuestionPaper = {
    id : Nat;
    metadata : PaperMetaData;
    questions : [Question];
    totalMarks : Nat;
  };

  module QuestionPaper {
    public func compare(paper1 : QuestionPaper, paper2 : QuestionPaper) : Order.Order {
      PaperId.compare(paper1.id, paper2.id);
    };
  };

  public type PaperDraftParams = {
    title : Text;
    subject : Text;
    grade : Text;
    numQuestions : Nat;
    marksPerQuestion : Nat;
    questionDistribution : {
      easy : Nat;
      medium : Nat;
      hard : Nat;
    };
  };

  public type UserRole = {
    #teacher;
    #student;
  };

  public type UserProfile = {
    name : Text;
    role : UserRole;
  };

  // Persistent storage
  var nextPaperId = 0;
  let papers = Map.empty<Nat, QuestionPaper>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Authorization state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Helper function to check if caller is a teacher
  func isTeacher(caller : Principal) : Bool {
    switch (userProfiles.get(caller)) {
      case (null) { false };
      case (?profile) {
        switch (profile.role) {
          case (#teacher) { true };
          case (#student) { false };
        };
      };
    };
  };

  // User profile management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Paper generation workflow
  public shared ({ caller }) func createPaperDraft(metadata : PaperMetaData, params : PaperDraftParams, questions : [Question]) : async QuestionPaper {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can create drafts");
    };

    // Only teachers can create question papers
    if (not isTeacher(caller) and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only teachers can create question papers");
    };

    // Verify that the creator in metadata matches the caller
    if (metadata.creator != caller) {
      Runtime.trap("Unauthorized: Cannot create paper for another user");
    };

    let totalMarks = questions.foldLeft(0, func(acc, q) { acc + q.marks });

    let paperId = nextPaperId;
    nextPaperId += 1;

    let draftPaper : QuestionPaper = {
      id = paperId;
      metadata;
      questions;
      totalMarks;
    };

    papers.add(paperId, draftPaper);
    draftPaper;
  };

  // Paper merging workflow
  public shared ({ caller }) func mergePapers(mergedMetadata : PaperMetaData, paperIds : [Nat]) : async QuestionPaper {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can merge papers");
    };

    // Only teachers can merge question papers
    if (not isTeacher(caller) and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only teachers can merge question papers");
    };

    // Verify that the creator in metadata matches the caller
    if (mergedMetadata.creator != caller) {
      Runtime.trap("Unauthorized: Cannot create merged paper for another user");
    };

    let isAdmin = AccessControl.isAdmin(accessControlState, caller);
    let mergedQuestions = List.empty<Question>();

    var totalMarks = 0;
    var paperIdIndex = 0;
    while (paperIdIndex < paperIds.size()) {
      let paperId = paperIds[paperIdIndex];
      switch (papers.get(paperId)) {
        case (null) {
          Runtime.trap("Invalid paper ID: " # paperId.toText());
        };
        case (?paper) {
          // Verify ownership: users can only merge their own papers, admins can merge any
          if (not isAdmin and paper.metadata.creator != caller) {
            Runtime.trap("Unauthorized: Can only merge your own papers");
          };

          for (question in paper.questions.values()) {
            mergedQuestions.add(question);
            totalMarks += question.marks;
          };
        };
      };
      paperIdIndex += 1;
    };

    let mergedPaper : QuestionPaper = {
      id = nextPaperId;
      metadata = mergedMetadata;
      questions = mergedQuestions.toArray();
      totalMarks;
    };

    papers.add(nextPaperId, mergedPaper);
    nextPaperId += 1;
    mergedPaper;
  };

  // CRUD operations
  public query ({ caller }) func getPaper(paperId : Nat) : async QuestionPaper {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view papers");
    };

    switch (papers.get(paperId)) {
      case (null) { Runtime.trap("Paper not found") };
      case (?paper) {
        // Users can only view their own papers, admins can view any
        if (paper.metadata.creator != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own papers");
        };
        paper;
      };
    };
  };

  public query ({ caller }) func listAllPapers() : async [QuestionPaper] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can list papers");
    };

    let isAdmin = AccessControl.isAdmin(accessControlState, caller);

    // Admins can see all papers, users only see their own
    if (isAdmin) {
      papers.values().toArray();
    } else {
      papers.values().toArray().filter(func(p) { p.metadata.creator == caller });
    };
  };

  public query ({ caller }) func listPapersByCreator(creator : Principal) : async [QuestionPaper] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can list papers");
    };

    // Users can only list their own papers, admins can list any user's papers
    if (creator != caller and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only list your own papers");
    };

    papers.values().toArray().filter(func(p) { p.metadata.creator == creator });
  };

  public query ({ caller }) func searchPapersByTitle(searchTerm : Text) : async [QuestionPaper] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can search papers");
    };

    let isAdmin = AccessControl.isAdmin(accessControlState, caller);

    // Admins can search all papers, users only search their own
    if (isAdmin) {
      papers.values().toArray().filter(func(p) { p.metadata.title.contains(#text searchTerm) });
    } else {
      papers.values().toArray().filter(
        func(p) {
          p.metadata.creator == caller and p.metadata.title.contains(#text searchTerm);
        }
      );
    };
  };
};
