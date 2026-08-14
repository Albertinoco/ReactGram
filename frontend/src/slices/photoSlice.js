import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import photoService from "../services/photoService";

const initialState = {
  photos: [],
  photo: {},
  error: false,
  success: false,
  loading: false,
  message: null,
  uploadLoading: false,
};
// delete photo
export const deletePhoto = createAsyncThunk(
  "photo/delete",
  async (id, thunkAPI) => {
    const token = thunkAPI.getState().auth.user?.token;
    const data = await photoService.deletePhoto(id, token);
    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }
    return data;
  },
);
export const getPhotos = createAsyncThunk(
  "photo/getall",
  async (_, thunkAPI) => {
    const token = thunkAPI.getState().auth.user?.token;

    const data = await photoService.getPhotos(token);
    // check for errors
    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }
    return data;
  },
);

export const uploadPhoto = createAsyncThunk(
  "photo/upload",
  async (data, thunkAPI) => {
    const token = thunkAPI.getState().auth.user?.token;

    const res = await photoService.uploadPhoto(data, token);

    return res;
  },
);

// get user photos
export const getUserPhotos = createAsyncThunk(
  "photo/userphotos",
  async (id, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;

    const data = await photoService.getUserPhotos(id, token);

    return data;
  },
);

// like photo
export const likePhoto = createAsyncThunk(
  "photo/like",
  async (id, thunkAPI) => {
    const token = thunkAPI.getState().auth.user?.token;
    const data = await photoService.likePhoto(id, token);
    if (data?.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }
    return data;
  },
);
// get foto by id
export const getPhoto = createAsyncThunk(
  "photo/getphoto",
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user?.token;
      const data = await photoService.getPhoto(id, token);
      if (data?.errors) {
        return thunkAPI.rejectWithValue(data.errors[0]);
      }
      return data;
    } catch (error) {
      const payload =
        error.data?.message || error.message || "Erro ao buscar a foto.";
      return thunkAPI.rejectWithValue(payload);
    }
  },
);
export const updatePhoto = createAsyncThunk(
  "photo/update",
  async ({ id, photoData }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user?.token;
      const data = await photoService.updatePhoto({ id, photoData }, token);

      if (data.errors) {
        return thunkAPI.rejectWithValue(data.errors[0]);
      }
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);
export const commentPhoto = createAsyncThunk(
  "photo/comment",
  async ({ id, comment }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user?.token;
      const data = await photoService.commentPhoto({ id, comment }, token);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);
export const photoSlice = createSlice({
  name: "photo",
  initialState,
  reducers: {
    resetMessage: (state) => {
      state.message = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(getPhotos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPhotos.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.photos = action.payload;
      })
      .addCase(getPhotos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.photos = [];
      })
      .addCase(uploadPhoto.pending, (state) => {
        state.uploadLoading = true;
        state.error = null;
      })
      .addCase(uploadPhoto.fulfilled, (state, action) => {
        state.uploadLoading = false;
        state.success = true;
        state.error = null;
        state.photos.unshift(action.payload);
        state.message = "Foto publicada com sucesso!";
      })
      .addCase(uploadPhoto.rejected, (state, action) => {
        state.uploadLoading = false;
        state.error = action.payload;
        state.photo = {};
      })
      .addCase(getUserPhotos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserPhotos.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.photos = action.payload;
      })

      .addCase(deletePhoto.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePhoto.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        const deletedId = action.meta.arg;
        state.photos = state.photos.filter((photo) => photo._id !== deletedId);
        state.message = action.payload?.message || "Foto deletada com sucesso.";
      })
      .addCase(deletePhoto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.photo = {};
      })
      .addCase(updatePhoto.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePhoto.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        const updatedPhoto = action.payload?.photo || action.payload;
        const updatedId = action.meta.arg.id;
        state.photos = state.photos.map((photo) => {
          if (photo._id === updatedId) {
            return { ...photo, ...updatedPhoto };
          }
          return photo;
        });
        state.message =
          action.payload?.message || "Foto atualizada com sucesso.";
      })
      .addCase(updatePhoto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getPhoto.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPhoto.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.photo = action.payload;
      })
      .addCase(likePhoto.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(likePhoto.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;

        const payload = action.payload || {};

        const photoId = payload.photoId || payload.photoIde || action.meta.arg;
        const userId =
          payload.userId || (payload.user && payload.user._id) || null;

        if (!photoId) {
          state.message = payload.message || "Foto curtida.";
          return;
        }

        // atualiza a foto aberta  se for a mesma
        if (state.photo && state.photo._id === photoId) {
          state.photo.likes = state.photo.likes || [];
          if (userId && !state.photo.likes.includes(userId)) {
            state.photo.likes.push(userId);
          }
        }

        // atualiza a lista de fotos
        state.photos = state.photos.map((photo) => {
          if (photo._id === photoId) {
            const currentLikes = photo.likes || [];
            if (userId && !currentLikes.includes(userId)) {
              return { ...photo, likes: [...currentLikes, userId] };
            }
          }
          return photo;
        });

        state.message = payload.message || "Foto curtida.";
      })
      .addCase(likePhoto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message;
      })
      .addCase(commentPhoto.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(commentPhoto.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;

        const payload = action.payload || {};
        const photoId = action.meta.arg?.id;

        const updatedPhoto = payload.photo || payload;
        if (updatedPhoto?._id && Array.isArray(updatedPhoto.comments)) {
          if (state.photo?._id === updatedPhoto._id) {
            state.photo = updatedPhoto;
          }
          state.photos = state.photos.map((photo) =>
            photo._id === updatedPhoto._id ? updatedPhoto : photo,
          );
        } else if (payload.comment && photoId) {
          const newComment = payload.comment;
          if (state.photo?._id === photoId) {
            state.photo.comments = [
              ...(state.photo.comments || []),
              newComment,
            ];
          }
          state.photos = state.photos.map((photo) => {
            if (photo._id === photoId) {
              return {
                ...photo,
                comments: [...(photo.comments || []), newComment],
              };
            }
            return photo;
          });
        }

        state.message = payload.message || "Comentário adicionado com sucesso.";
      })
      .addCase(commentPhoto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message;
      });
  },
});

export const { resetMessage } = photoSlice.actions;
export default photoSlice.reducer;
