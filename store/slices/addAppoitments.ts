import { AppointmentData, errHandle } from '@/app/constant/allTypes/AllTypes';
import instance from '@/utils/instance';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';


const initialState:errHandle = {
  loading: false,
  error:  null,
};



export const postAppointment = createAsyncThunk(
  'appointments/postAppointment',
  async (requestData: AppointmentData, { rejectWithValue }) => {
    try {
      const response = await instance.post('appointments',requestData)
      if (response.status !== 200) {
        throw new Error('Failed to submit appoitment');
      }
      const data = await response.data;
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);




const appointmentSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(postAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postAppointment.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(postAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default appointmentSlice.reducer;