export const ValidationMessages = {
  api: {
    request: {
      auth: {
        local: {
          register: {
            EMAIL_REQUIRED: 'Email is required',
            EMAIL_INVALID: 'Email invalid'
          },
          verifyEmailRegister: {
            EMAIL_REQUIRED: 'Email is required',
            EMAIL_INVALID: 'Email invalid',
            OTP_REQUIRED: 'OTP Required',
            OTP_MAX_LENGTH: 'Max length OTP is',
            OTP_INVALID: 'OTP invalid'
          },

          setPassword: {
            EMAIL_INVALID: 'Email invalid',
            EMAIL_REQUIRED: 'Email is required',
            PASSWORD_REQUIRED: 'Password is required',
            PASSWORD_CONFIRM_REQUIRED: 'Password confirm is required',
            WEAK_PASSWORD: 'Password must include at last one lowercase, uppercase, and number',
            TOKEN_SET_PASSWORD_REQUIRED: 'Token set password is required',
            PASSWORD_CONFIRM_MISMATCH: 'Password confirm not match with password'
          },

          resendVerifyEmail: {
            EMAIL_INVALID: 'Email invalid',
            EMAIL_REQUIRED: 'Email is required'
          },
          resendSetPasswordToken: {
            EMAIL_INVALID: 'Email invalid',
            EMAIL_REQUIRED: 'Email is required'
          },
          forgotPassword: {
            EMAIL_INVALID: 'Email invalid',
            EMAIL_REQUIRED: 'Email is required'
          },
          resetPassword: {
            RESET_PASSWORD_TOKEN_REQUIRED: 'ResetPasswordToken is required',
            PASSWORD_CONFIRM_MISMATCH: 'Password confirm mismatch with password',
            PASSWORD_CONFIRM_REQUIRED: 'Password confirm is required'
          },
          resendResetPasswordToken: {
            EMAIL_INVALID: 'Email invalid',
            EMAIL_REQUIRED: 'Email is required'
          },
          refreshToken: {
            REFRESH_TOKEN_REQUIRED: 'RefreshToken is required'
          }
        }
      },
      userProfile: {
        deleteAvatar: {
          PUBLIC_ID_REQUIRED: 'PublicId is required'
        }
      },
      category: {
        changeParentId: {
          PARENT_ID_REQUIRED: 'ParentId is required'
        }
      }
    }
  },
  userAuth: {
    INVALID_EMAIL: 'Email invalid',
    WEAK_PASSWORD: 'Password must include at last one lowercase, uppercase, and number',
    WEAK_PASSWORD_CONFIRM: 'Password confirm must include at last one lowercase, uppercase, and number',
    PASSWORD_MISMATCH: 'Password do not match',
    MIN_LENGTH_PASSWORD: 'Password must be length equal or greater than 8',
    MAX_LENGTH_PASSWORD: 'Password must be length equal or less than 16',
    MIN_LENGTH_PASSWORD_CONFIRM: 'Password confirm must be length equal or greater than 8',
    MAX_LENGTH_PASSWORD_CONFIRM: 'Password confirm must be length equal or less than 16',
    EMAIL_REQUIRED: 'Email is required for local provider',
    PASSWORD_REQUIRED: 'Password is required for local provider',
    PASSWORD_CONFIRM_REQUIRED: 'Password confirm is required for local provider',
    ZALO_ID_REQUIRED: 'Zalo ID is required for zalo provider',
    BLOCKED_STATUS_MESSAGE_REQUIRED: 'Account lock content is required',
    USER_PROFILE_ID_REQUIRED: 'UserProfileId is required'
  },

  userProfile: {
    USER_AUTH_ID_REQUIRED: 'UserAuthId is required',
    FIRST_NAME_REQUIRED: 'First name is required',
    FIRST_NAME_MIN_LENGTH: 'First name must be length equal or greater than 3',
    LAST_NAME_MIN_LENGTH: 'Last name must be length equal or greater than 3',
    LAST_NAME_REQUIRED: 'Last name is required',
    PHONE_REQUIRED: 'Phone is required',
    PHONE_INVALID: 'Number phone invalid',
    AVATAR_PUBLIC_ID_REQUIRED: 'PublicId avatar is required',
    AVATAR_URL_REQUIRED: 'Avatar url is required'
  },

  brand: {
    NAME_REQUIRED: 'Name brand is required',
    PUBLIC_ID_BANNERS_REQUIRED: 'PublicId of banners is required',
    URL_BANNERS_REQUIRED: 'Url of banners is required',
    PUBLIC_ID_LOGO_REQUIRED: 'PublicId logo is required',
    URL_LOGO_REQUIRED: 'Url of logo is required'
  },

  category: {
    NAME_REQUIRED: 'Name category is required',
    SLUG_REQUIRED: 'Slug category is required'
  }
};
