// apiSlice.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://sample-lb-51711970.ap-south-1.elb.amazonaws.com/",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token; // Getting the token directly from getState
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // get all games
    getAllGames: builder.mutation({
      query: (data) => ({
        url: "api/Game/admin/getallgames",
        method: "POST",
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
    // get all categories
    getAllCategories: builder.mutation({
      query: (data) => ({
        url: "api/Category/admin/getallcategories",
        method: "POST",
        body: data,
      }),
    }),
    addGame: builder.mutation({
      query: (data) => ({
        url: "api/Game/admin/creategame",
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
  }),
});

export const {
  useGetAllGamesMutation,
  useGetAllCategoriesMutation,
  useAddGameMutation,
  useGetTournamentByGameIdMutation,
  useGetAllTournamentMutation,
  useGetRewardTierListMutation,
  useGetRewardTierInfoMutation,
  useAddRewardTierMutation,
} = apiSlice;
