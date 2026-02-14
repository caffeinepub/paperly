import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";

module {
  // Old types from previous version
  type OldUserProfile = {
    name : Text;
  };

  type OldActor = {
    nextPaperId : Nat;
    papers : Map.Map<Nat, QuestionPaper>;
    userProfiles : Map.Map<Principal, OldUserProfile>;
  };

  type QuestionPaper = {
    id : Nat;
    metadata : PaperMetaData;
    questions : [Question];
    totalMarks : Nat;
  };

  type PaperMetaData = {
    title : Text;
    subject : Text;
    grade : Text;
    creator : Principal;
  };

  type Question = {
    text : Text;
    options : [Text];
    correctAnswer : Nat;
    marks : Nat;
    difficulty : Difficulty;
  };

  type Difficulty = {
    #easy;
    #medium;
    #hard;
  };

  // New types
  type UserRole = {
    #teacher;
    #student;
  };

  type NewUserProfile = {
    name : Text;
    role : UserRole;
  };

  type NewActor = {
    nextPaperId : Nat;
    papers : Map.Map<Nat, QuestionPaper>;
    userProfiles : Map.Map<Principal, NewUserProfile>;
  };

  // Migration function to initialize all existing profiles with a default role
  public func run(old : OldActor) : NewActor {
    let newUserProfiles = old.userProfiles.map<Principal, OldUserProfile, NewUserProfile>(
      func(_principal, oldProfile) {
        { oldProfile with role = #teacher };
      }
    );
    {
      old with
      userProfiles = newUserProfiles
    };
  };
};
