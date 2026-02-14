import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface QuestionPaper {
    id: bigint;
    totalMarks: bigint;
    metadata: PaperMetaData;
    questions: Array<Question>;
}
export interface Question {
    marks: bigint;
    difficulty: Difficulty;
    text: string;
    correctAnswer: bigint;
    options: Array<string>;
}
export interface PaperMetaData {
    title: string;
    creator: Principal;
    subject: string;
    grade: string;
}
export interface PaperDraftParams {
    title: string;
    subject: string;
    numQuestions: bigint;
    grade: string;
    marksPerQuestion: bigint;
    questionDistribution: {
        easy: bigint;
        hard: bigint;
        medium: bigint;
    };
}
export interface UserProfile {
    name: string;
    role: UserRole;
}
export enum Difficulty {
    easy = "easy",
    hard = "hard",
    medium = "medium"
}
export enum UserRole {
    teacher = "teacher",
    student = "student"
}
export enum UserRole__1 {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole__1): Promise<void>;
    createPaperDraft(metadata: PaperMetaData, params: PaperDraftParams, questions: Array<Question>): Promise<QuestionPaper>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole__1>;
    getPaper(paperId: bigint): Promise<QuestionPaper>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    listAllPapers(): Promise<Array<QuestionPaper>>;
    listPapersByCreator(creator: Principal): Promise<Array<QuestionPaper>>;
    mergePapers(mergedMetadata: PaperMetaData, paperIds: Array<bigint>): Promise<QuestionPaper>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchPapersByTitle(searchTerm: string): Promise<Array<QuestionPaper>>;
}
