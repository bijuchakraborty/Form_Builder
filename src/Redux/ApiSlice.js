import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8000/" }),
    tagTypes: ["Forms", "Responses", "Users"],
    endpoints: (builder) => ({
        getForms: builder.query({
            query: () => "forms",
            providesTags: ["Forms"],
        }),

        getFormById: builder.query({
            query: (id) => `forms/${id}`,
            providesTags: (result, error, id) => [{ type: "Forms", id }], // Tag individual forms
        }),

        createForm: builder.mutation({
            query: (newForm) => ({
                url: "forms",
                method: "POST",
                body: newForm,
            }),
            invalidatesTags: ["Forms"],
        }),

        updateForm: builder.mutation({
            query: ({ id, ...updatedForm }) => ({
                url: `forms/${id}`,
                method: "PUT",
                body: updatedForm,
            }),
            invalidatesTags: ({ id }) => [{ type: "Forms", id }],
        }),

        getResponses: builder.query({
            query: () => "responses",
            providesTags: ["Responses"],
        }),

        submitResponse: builder.mutation({
            query: (response) => ({
                url: "responses",
                method: "POST",
                body: response,
            }),
            invalidatesTags: ["Responses"],
        }),
        login: builder.mutation({
            query: (credentials) => ({
                url: `users?username=${credentials.username}&password=${credentials.password}`,
                method: 'GET',
            }),
            providesTags: ["Users"],
            transformResponse: (response) => response[0],
        }),
    }),
});

export const {
    useGetFormsQuery,
    useCreateFormMutation,
    useUpdateFormMutation,
    useGetFormByIdQuery,
    useGetResponsesQuery,
    useSubmitResponseMutation,
    useLoginMutation,
} = apiSlice;