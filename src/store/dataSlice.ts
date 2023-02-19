/* eslint-disable no-param-reassign */
import {
  AnyAction,
  createAsyncThunk,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import DataService from '../services/DataService';
import {
  DataUpdate,
  FullClientData,
  FullContactData,
  FullUserData,
  ProfileData,
  UserRoles,
} from '../types/types';

export const fetchData = createAsyncThunk(
  'data/fetchData',
  // eslint-disable-next-line no-unused-vars, consistent-return
  async (_, { rejectWithValue }) => {
    try {
      const response = await DataService.fetchData();
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
    }
  },
);

function isError(action: AnyAction) {
  return action.type.endsWith('rejected');
}

const emptyProfile = {
  _id: '',
  role: UserRoles.Salesman,
  data: {
    mail: '',
    firstName: '',
    patronymic: '',
    surname: '',
    birthday: '',
    phone: '',
  },
  settings: {
    language: '',
  },
};

const dataSlice = createSlice({
  name: 'data',
  initialState: {
    isLoading: false,
    error: '',
    profile: emptyProfile as ProfileData,
    contacts: [] as FullContactData[],
    clients: [] as FullClientData[],
    users: [] as FullUserData[],
  },
  reducers: {
    updateData(state, action: PayloadAction<DataUpdate>) {
      const data = action.payload;
      if (data?.profile) {
        state.profile = data.profile;
      }
      if (data?.clients) {
        state.clients = data.clients;
      }
      if (data?.contacts) {
        state.contacts = data.contacts;
      }
      if (data?.users) {
        state.users = data.users;
      }
    },
    clearData(state) {
      state.profile = emptyProfile as ProfileData;
      state.contacts = [] as FullContactData[];
      state.clients = [] as FullClientData[];
      state.users = [] as FullUserData[];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.pending, (state) => {
        state.profile = emptyProfile;
        state.clients = [];
        state.contacts = [];
        state.users = [];
        state.isLoading = true;
        state.error = '';
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = '';
        const data = action.payload;
        if (data) {
          state.profile = data.profile;
          state.clients = data.clients;
          state.contacts = data.contacts;
          state.users = data.users;
        }
      })

      .addMatcher(isError, (state, action) => {
        state.profile = emptyProfile;
        state.clients = [];
        state.contacts = [];
        state.users = [];
        state.isLoading = false;
        if (typeof action.payload === 'string') {
          state.error = action.payload;
        }
      });
  },
});

export const { updateData, clearData } = dataSlice.actions;

export default dataSlice.reducer;
