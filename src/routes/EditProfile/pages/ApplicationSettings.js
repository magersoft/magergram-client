import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import style from '../EditProfile.module.scss';
import { Checkbox, RadioButton } from '../../../components/UI';
import { useMutation } from '@apollo/react-hooks';
import { CHANGE_LANGUAGE, TOGGLE_DARK_MODE } from '../EditProfileQueries';
import { SET_LANGUAGE, TOGGLE_DARK_MODE_CLIENT } from '../../../apollo/GlobalQueries';
import { MY_PROFILE } from '../../../layout/Main/MainQueries';
import Spinner from '../../../components/Loader/Spinner';

export default ({ user }) => {
  const { t, i18n } = useTranslation();
  const [isDarkTheme, setDarkTheme] = useState(false);
  const [language, setLanguage] = useState([
    { label: 'Русский', value: 'ru', checked: false, disabled: false },
    { label: 'English', value: 'en', checked: false, disabled: false }
  ]);

  useEffect(() => {
    if (user) {
      const { language: userLanguage, darkMode } = user;
      setDarkTheme(darkMode);
      setLanguage(language => language.map(lng => {
        lng.checked = lng.value === userLanguage;
        return lng
      }))
    }
  }, [user]);

  const [toggleDarkMode, { loading: loadingDarkMode }] = useMutation(TOGGLE_DARK_MODE);
  const [changeLanguage, { loading: loadingChangeLanguage }] = useMutation(CHANGE_LANGUAGE);
  const [setClientLanguage] = useMutation(SET_LANGUAGE);
  const [toggleDarkModeClient] = useMutation(TOGGLE_DARK_MODE_CLIENT);

  const handleToggleDarkMode = event => {
    const { target: { checked } } = event;
    setDarkTheme(checked);
    toggleDarkMode({
      variables: {
        darkMode: checked
      },
      update: (_, result) => {
        const { data: { darkMode } } = result;
        if (darkMode) {
          toggleDarkModeClient({
            variables: {
              checked
            }
          })
        }
      },
      refetchQueries: [{ query: MY_PROFILE }]
    })
  };

  const handleLanguageChange = event => {
    const { target: { value } } = event;
    setLanguage(language.map(lng => {
      lng.checked = lng.value === value;
      return lng;
    }));
    changeLanguage({
      variables: {
        lang: value
      },
      update: (cache, result) => {
        const { data: { changeLanguage } } = result;
        if (changeLanguage) {
          i18n.changeLanguage(value);
          setClientLanguage({
            variables: {
              lang: value
            }
          });
        }
      },
      refetchQueries: [{ query: MY_PROFILE }]
    })
  };

  return (
    <main className={style.Main}>
      <section className={style.Section}>
        <h2 className={style.Title}>{t('Application settings')}</h2>
        <div className={loadingDarkMode ? style.SectionLoading : ''}>
          <Checkbox
            label={t('Dark theme')}
            checked={isDarkTheme}
            disabled={loadingDarkMode}
            onChange={handleToggleDarkMode}
          />
          <p className={style.HelperText}>{ t('You can activate dark mode in application. This action apply in all your authorized application') } Magergam.</p>
        </div>
        { loadingDarkMode &&
        <div className={style.SectionLoadingSpinner}>
          <Spinner fill="var(--color-accent)" />
        </div>
        }
      </section>
      <section className={style.Section}>
        <h2 className={style.Title}>{t('Application language')}</h2>
        <div className={loadingChangeLanguage ? style.SectionLoading : ''}>
          <RadioButton
            buttons={language}
            name="language"
            onChange={handleLanguageChange}
          />
          <p className={style.HelperText}>{ t('You can change application language. This action apply in all your authorized application') } Magergam.</p>
        </div>
        { loadingChangeLanguage &&
        <div className={style.SectionLoadingSpinner}>
          <Spinner fill="var(--color-accent)" />
        </div>
        }
      </section>
    </main>
  )
}
