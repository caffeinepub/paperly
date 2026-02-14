import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { QuestionPaper, Question, UserProfile } from '../backend';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useListAllPapers() {
  const { actor, isFetching } = useActor();

  return useQuery<QuestionPaper[]>({
    queryKey: ['papers'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listAllPapers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetPaper(paperId: bigint) {
  const { actor, isFetching } = useActor();

  return useQuery<QuestionPaper>({
    queryKey: ['paper', paperId.toString()],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getPaper(paperId);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreatePaperDraft() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      title,
      subject,
      grade,
      questions,
    }: {
      title: string;
      subject: string;
      grade: string;
      questions: Question[];
    }) => {
      if (!actor) throw new Error('Actor not available');
      if (!identity) throw new Error('Not authenticated');

      const metadata = {
        title,
        subject,
        grade,
        creator: identity.getPrincipal(),
      };

      const params = {
        title,
        subject,
        grade,
        numQuestions: BigInt(questions.length),
        marksPerQuestion: questions.length > 0 ? questions[0].marks : BigInt(5),
        questionDistribution: {
          easy: BigInt(0),
          medium: BigInt(0),
          hard: BigInt(0),
        },
      };

      return actor.createPaperDraft(metadata, params, questions);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['papers'] });
    },
  });
}

export function useMergePapers() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      title,
      subject,
      grade,
      paperIds,
    }: {
      title: string;
      subject: string;
      grade: string;
      paperIds: bigint[];
    }) => {
      if (!actor) throw new Error('Actor not available');
      if (!identity) throw new Error('Not authenticated');

      const metadata = {
        title,
        subject,
        grade,
        creator: identity.getPrincipal(),
      };

      return actor.mergePapers(metadata, paperIds);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['papers'] });
    },
  });
}
