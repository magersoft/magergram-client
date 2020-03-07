import React, { useState } from 'react';
import style from './SignUp.module.scss';
import { useTranslation } from 'react-i18next';
import { AppButtons, Button, Input, Separator } from '../../components/UI';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';
import { CONFIRM_SECRET, EXIST_USER, SIGN_UP } from './SignUpQueries';
import { LOG_USER_IN } from '../../apollo/GlobalQueries';
import { isValidPhone } from '../../utils/phoneRegExp';
import Helmet from 'react-helmet';

export default ({ history }) => {
  const [state, setState] = useState({
    phoneOrEmail: '',
    fullName: '',
    username: '',
    password: '',
    loginSecret: '',
    error: null,
    usernameFieldIcon: ''
  });
  const [confirm, setConfirm] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [checkUserExist] = useMutation(EXIST_USER);
  const [signUp, { loading }] = useMutation(SIGN_UP);
  const [logUserIn] = useMutation(LOG_USER_IN);
  const [confirmSecret, { loading: secretLoading }] = useMutation(CONFIRM_SECRET);
  const { t } = useTranslation();

  const onSubmit = event => {
    event.preventDefault();
    let phone;
    let email;
    if (state.phoneOrEmail.match(isValidPhone)) {
      phone = state.phoneOrEmail;
      setConfirmText(t('An sms with a secret code has been sent to your phone number'))
    } else {
      email = state.phoneOrEmail;
      setConfirmText(t('An email with a secret code has been sent to your email'))
    }
    signUp({
      variables: {
        username: state.username,
        email,
        phone,
        password: state.password,
        firstName: state.fullName.split(' ')[0],
        lastName: state.fullName.split(' ')[1]
      },
      update: (_, result) => {
        const { data: { createAccount } } = result;
        if (createAccount.ok) {
          setConfirm(true);
          setState({ ...state, error: null })
        } else {
          console.log(createAccount.error);
          setState({ ...state, error: createAccount.error })
        }
      }
    })
  };

  const onLoginSecret = event => {
    event.preventDefault();
    let phone;
    let email;
    if (state.phoneOrEmail.match(isValidPhone)) {
      phone = state.phoneOrEmail;
    } else {
      email = state.phoneOrEmail;
    }
    confirmSecret({
      variables: {
        email,
        phone,
        secret: state.loginSecret
      },
      update: (_, result) => {
        const { data: { confirmSecret } } = result;
        if (confirmSecret) {
          logUserIn({
            variables: {
              token: confirmSecret
            },
            update: (_, __) => {
              window.location.reload();
            }
          });
        }
      }
    })
  };

  const handleChange = prop => event => {
    setState({ ...state, [prop]: event.target.value })
  };

  const checkUsername = () => {
    if (state.username) {
      checkUserExist({
        variables: {
          username: state.username
        },
        update: (_, result) => {
          const { data: { checkExistUsername } } = result;
          if (!checkExistUsername.ok) {
            setState({
              ...state,
              error: checkExistUsername.error,
              usernameFieldIcon: style.ErrorIcon
            })
          } else {
            setState({
              ...state,
              usernameFieldIcon: style.SuccessIcon,
              error: null
            })
          }
        }
      });
    }
  };

  return (
    <div className={style.Content}>
      <Helmet>
        <title>Sign Up | Magergram</title>
      </Helmet>
      <div className={style.Box}>
        <h1 className={`${style.Title} sprite`}>Magergram</h1>
        { !confirm ?
          <form className={style.Form} method="post" onSubmit={onSubmit}>
            <h2 className={style.Subtitle}>
              { t('Sign Up, to watch photos and videos of your friends.') }
            </h2>
            <div className={style.SocialLogin}>
              <Button label={t('Login with Facebook')} />
            </div>
            <Separator text={t('or')} />
            <div className={style.Control}>
              <Input
                value={state.phoneOrEmail}
                placeholder={t('Phone or email')}
                required
                onChange={handleChange('phoneOrEmail')}
              />
            </div>
            <div className={style.Control}>
              <Input
                value={state.fullName}
                placeholder={t('First name and Last name')}
                onChange={handleChange('fullName')}
              />
            </div>
            <div className={style.Control}>
              <Input
                value={state.username}
                placeholder={t('Username')}
                required
                icon={state.usernameFieldIcon}
                onChange={handleChange('username')}
                onBlur={checkUsername}
              />
            </div>
            <div className={style.Control}>
              <Input
                value={state.password}
                type="password"
                placeholder={t('Password')}
                required
                onChange={handleChange('password')}
              />
            </div>
            <div className={style.Submit}>
              <Button label={t('Sign Up')} disabled={loading} />
            </div>
          </form>
          :
          <form className={style.Form} method="post" onSubmit={onLoginSecret}>
            <div className={style.Control}>
              <Input
                value={state.loginSecret}
                placeholder={t('Confirm secret')}
                onChange={handleChange('loginSecret')}
              />
            </div>
            <p className={style.ConfirmText}>{ confirmText } <span>{ state.phoneOrEmail }</span></p>
            <div className={style.Submit}>
              <Button label={t('Login')} disabled={secretLoading} />
            </div>
          </form>
        }
        { state.error &&
          <div className={style.Error}>
            <p role="alert">
              { t(state.error.trim()) }
            </p>
          </div>
        }
      </div>
      <div className={style.Box}>
        <div className={style.SignUp}>
          <p className={style.SignUpText}>
            { t('Have an account') }?
            <Link to="/" >
              <span className={style.SignUpLink}>{t('Sign In')}</span>
            </Link>
          </p>
        </div>
      </div>
      <AppButtons />
    </div>
  )
};
