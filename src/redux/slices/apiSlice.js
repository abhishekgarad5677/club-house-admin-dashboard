// apiSlice.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://yi0mygd2qi.execute-api.ap-south-1.amazonaws.com/Prod",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token; // Getting the token directly from getState
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // games end points starts
    getAllGames: builder.mutation({
      query: (data) => ({
        url: "api/Game/all",
        method: "GET",
        params: data,
      }),
    }),
    getGameById: builder.query({
      query: (id) => ({
        url: "api/Game/get-by-id",
        method: "GET",
        params: { id },
      }),
    }),
    toggleGameMaintenance: builder.mutation({
      query: (data) => ({
        url: "api/Game/toggle-maintenance",
        method: "PATCH",
        body: data,
      }),
    }),
    toggleGameLive: builder.mutation({
      query: (data) => ({
        url: "api/Game/toggle-live",
        method: "PATCH",
        body: data,
      }),
    }),
    getTournamentByGameId: builder.mutation({
      query: (data) => ({
        url: "api/Tournament/admin/getalltournamentsbygameid",
        method: "POST",
        body: data,
      }),
    }),
    getGameUploadFileUrls: builder.query({
      query: ({ IconName, AosName, IosName }) => ({
        url: "api/Game/upload-game-files-urls",
        method: "GET",
        params: {
          IconName,
          AosName,
          IosName,
        },
      }),
    }),

    // games end points ends
    // categories end points starts
    getAllCategories: builder.mutation({
      query: (data) => ({
        url: "api/Category/get-all",
        method: "POST",
        body: data,
      }),
    }),
    addCategory: builder.mutation({
      query: (data) => ({
        url: "api/Category/create",
        method: "POST",
        body: data,
      }),
    }),
    // categories end points ends
    addGame: builder.mutation({
      query: (data) => ({
        url: "api/Game/create",
        method: "POST",
        body: data,
      }),
    }),
    getAllTournament: builder.mutation({
      query: (data) => ({
        url: "api/Tournament/admin/getalltournaments",
        method: "POST",
        body: data,
      }),
    }),
    getRewardTierList: builder.mutation({
      query: (data) => ({
        url: "/api/Tournament/get-reward-tierset",
        method: "POST",
        body: data,
      }),
    }),
    getRewardTierInfo: builder.mutation({
      query: (data) => ({
        url: "/api/Tournament/get-reward-tierset-by-id",
        method: "POST",
        body: data,
      }),
    }),
    addRewardTier: builder.mutation({
      query: (data) => ({
        url: "/api/Tournament/reward-tierset",
        method: "POST",
        body: data,
      }),
    }),
    // User management starts
    getAllUsers: builder.mutation({
      query: (body) => ({
        url: "/api/UserManagement/search-users",
        method: "POST",
        body,
      }),
    }),
    getUserProfileWallet: builder.query({
      query: (email) => ({
        url: "api/UserManagement/get-user-profile-wallet",
        method: "GET",
        params: { email },
      }),
    }),
    getUserLifetimeTransactions: builder.query({
      query: ({ emailId, pageSize = 10, nextToken = "" }) => ({
        url: "api/UserManagement/getuserlifetimetransactions",
        method: "GET",
        params: {
          emailId: emailId,
          pageSize: pageSize,
          ...(nextToken ? { nextToken: nextToken } : {}),
        },
      }),
    }),
    getUserTournaments: builder.query({
      query: ({ emailId, pageSize = 10, nextToken = "" }) => ({
        url: "api/UserManagement/get-user-tournaments",
        method: "GET",
        params: {
          emailId: emailId,
          pageSize: pageSize,
          ...(nextToken ? { nextToken: nextToken } : {}),
        },
      }),
    }),
    updateUserBan: builder.mutation({
      query: (emailId) => ({
        url: "api/UserManagement/updateuserban",
        method: "PUT",
        body: { emailId },
      }),
    }),
    // User management ends
  }),
});

export const {
  useGetAllGamesMutation,
  useGetGameByIdQuery,
  useToggleGameMaintenanceMutation,
  useToggleGameLiveMutation,
  useLazyGetGameUploadFileUrlsQuery,
  useGetAllCategoriesMutation,
  useAddCategoryMutation,
  useAddGameMutation,
  useGetTournamentByGameIdMutation,
  useGetAllTournamentMutation,
  useGetRewardTierListMutation,
  useGetRewardTierInfoMutation,
  useAddRewardTierMutation,
  useGetAllUsersMutation,
  useGetUserProfileWalletQuery,
  useLazyGetUserLifetimeTransactionsQuery,
  useLazyGetUserTournamentsQuery,
  useUpdateUserBanMutation,
} = apiSlice;
