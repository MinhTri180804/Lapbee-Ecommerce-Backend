class _SubjectSendEmail {
  static instance: _SubjectSendEmail;

  private constructor() {}

  static getInstance() {
    if (!_SubjectSendEmail.instance) {
      _SubjectSendEmail.instance = new _SubjectSendEmail();
    }

    return _SubjectSendEmail.instance;
  }

  public verifyEmail() {
    return 'Xác nhận đăng ký tài khoản';
  }
}

export const SubjectSendEmail = _SubjectSendEmail.getInstance();
