import TimeAgo from 'javascript-time-ago';

import en from 'javascript-time-ago/locale/en';
import ru from 'javascript-time-ago/locale/ru';

TimeAgo.addLocale(en);
TimeAgo.addLocale(ru);

export default new TimeAgo('ru-RU');
