import React, { useEffect, useState } from 'react';
import Helmet from 'react-helmet';
import style from './RecoveryPassword.module.scss';
import { Button, Input, MainLogo, Separator } from '../../components/UI';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AuthFooter from '../../components/AuthFooter';
import { RECOVERY_PASSWORD, RECOVERY_PASSWORD_TOKEN, RESET_PASSWORD } from './RecoveryPasswordQueries';
import Spinner from '../../components/Loader/Spinner';
import Toast from '../../components/Toast';

const DARK_MODE = gql`
  {
    darkMode @client
  }
`;

const TOAST_DELAY = 3000;

function getToken(search) {
  return search.replace('?token=', '')
}

export default ({ location, history }) => {
  const { t } = useTranslation();
  const [state, setState] = useState({
    usernameOrEmail: '',
    newPassword: '',
    confirmPassword: '',
    error: null,
    token: getToken(location.search) || null,
    userId: null,
    loading: false,
    emailSubmitted: false,
    toastShow: false,
    disabled: false
  });

  const [recoveryPassword, { loading: loadingRecovery }] = useMutation(RECOVERY_PASSWORD);
  const [recoveryPasswordToken, { loading: loadingRecoveryToken }] = useMutation(RECOVERY_PASSWORD_TOKEN);
  const [resetPassword, { loading: loadingResetPassword }] = useMutation(RESET_PASSWORD);

  useEffect(() => {
    if (state.token) {
      recoveryPasswordToken({
        variables: {
          token: state.token
        },
        update: (_, result) => {
          const { data: { recoveryPasswordByToken } } = result;
          if (recoveryPasswordByToken.ok) {
            const { user } = recoveryPasswordByToken;
            setState(prevState => ({ ...prevState, userId: user.id }))
          } else {
            setState({ ...state, error: recoveryPasswordByToken.error })
          }
        }
      })
    }
  }, [state.token])

  const handleChange = prop => event => {
    setState({ ...state, [prop]: event.target.value });
  }

  const onSubmit = event => {
    event.preventDefault();
    recoveryPassword({
      variables: {
        usernameOrEmail: state.usernameOrEmail
      },
      update: (_, result) => {
        const { data: { recoveryPassword } } = result;
        if (recoveryPassword.ok) {
          setState({ ...state, emailSubmitted: true, error: null });
        } else {
          setState({ ...state, error: recoveryPassword.error })
        }
      }
    })
  };

  const onSubmitNewPassword = event => {
    event.preventDefault();
    if (state.confirmPassword !== state.newPassword) {
      setState({ ...state, error: t('New password different') });
      return false;
    }
    resetPassword({
      variables: {
        userId: state.userId,
        newPassword: state.newPassword,
        confirmPassword: state.confirmPassword
      },
      update: (_, result) => {
        const { data: { resetPassword } } = result;
        if (resetPassword.ok) {
          setState({
            ...state,
            error: null,
            loading: true,
            toastShow: true,
            disabled: true
          });
          setTimeout(() => {
            history.push('/');
          }, TOAST_DELAY)
        } else {
          setState({ ...state, error: resetPassword.error });
        }
      }
    })
  }

  const { data: { darkMode } } = useQuery(DARK_MODE);

  return (
    <React.Fragment>
      <div className={style.Content}>
        <Helmet>
          <title>{ t('Recovery password') } | Magergram</title>
        </Helmet>
        <div className={style.Box}>
          <MainLogo darkMode={darkMode} />
          { !state.emailSubmitted
            ? (state.loading || loadingRecovery || loadingResetPassword || loadingRecoveryToken)
              ? <div className={style.Loading}>
                  <Spinner width={60} height={60} />
                </div>
              : state.token && state.userId
                  ? <React.Fragment>
                      <h1 className={style.Title}>{ t('Password reset') }</h1>
                      <p className={style.Subtitle}>{ t('Create a new password') }</p>
                      <form className={style.Form} method="post" onSubmit={onSubmitNewPassword}>
                        <div className={style.Control}>
                          <Input
                            type="password"
                            value={state.newPassword}
                            placeholder={t('New password')}
                            name="newPassword"
                            required
                            disabled={state.disabled}
                            onChange={handleChange('newPassword')}
                          />
                        </div>
                        <div className={style.Control}>
                          <Input
                            type="password"
                            value={state.confirmPassword}
                            placeholder={t('Confirm password')}
                            name="confirmPassword"
                            required
                            disabled={state.disabled}
                            onChange={handleChange('confirmPassword')}
                          />
                        </div>
                        <div className={style.Button}>
                          <Button label={t('Save password')} disabled={state.disabled} />
                        </div>
                        { state.error &&
                        <div className={style.Error}>
                          <p role="alert">
                            { t(state.error) }
                          </p>
                        </div>
                        }
                      </form>
                    </React.Fragment>
                  : <React.Fragment>
                    <h1 className={style.Title}>{ t('Can\'t log in?') }</h1>
                    <p className={style.Subtitle}>{ t('Enter username or email and we send your link for recover access to the account') }</p>
                    <form className={style.Form} method="post" onSubmit={onSubmit}>
                      <div className={style.Control}>
                        <Input
                          value={state.usernameOrEmail}
                          placeholder={t('Username or email')}
                          name="username"
                          required
                          disabled={state.disabled}
                          onChange={handleChange('usernameOrEmail')}
                        />
                      </div>
                      <div className={style.Button}>
                        <Button label={t('Recovery password')} disabled={state.disabled} />
                      </div>
                      { state.error &&
                      <div className={style.Error}>
                        <p role="alert">
                          { t(state.error) }
                        </p>
                      </div>
                      }
                    </form>
                    <Separator text={t('or')} />
                    <div className={style.CreateAccount}>
                      <Link to="/signup">{ t('Create new account') }</Link>
                    </div>
                  </React.Fragment>
            : <React.Fragment>
                <h1 className={style.Title}>{ t('Email submitted') }</h1>
                <p className={style.Subtitle}>{ t('Check your mail. You should receive an email with a link to reset your password. If nothing, check spam.') }</p>
              </React.Fragment>
            }
        </div>
        <div className={style.Box}>
          <AuthFooter
            text="Remember password?"
            linkText="Login"
            linkPath="/"
          />
        </div>
      </div>
      <Toast show={state.toastShow} duration={TOAST_DELAY} message={t('Password was be changed')} />
    </React.Fragment>
  )
}
