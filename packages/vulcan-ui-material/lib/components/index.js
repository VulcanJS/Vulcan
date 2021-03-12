import './accounts/AccountsButton';
import './accounts/AccountsButtons';
import './accounts/AccountsField';
import './accounts/AccountsFields';
import './accounts/AccountsForm';
import './accounts/AccountsPasswordOrService';
import './accounts/AccountsSocialButtons';

import './bonus/DatatableFromArray';
import './bonus/LoadMore';
import './bonus/SearchInput';
import './bonus/TooltipButton';
import './bonus/TooltipIconButton';
import './bonus/TooltipIntl';

import './core/Avatar';
import './core/Card';
import './core/Datatable';
import './core/EditButton';
import './core/Flash';
import './core/Loading';
import './core/NewButton';

import './forms/base-controls/RequiredIndicator';
import './forms/base-controls/FormControlLayout';

import './forms/FormComponentInner';
import './forms/FormErrors';
import './forms/FormGroupDefault';
import './forms/FormGroupLine';
import './forms/FormGroupNone';
import './forms/FormNestedArrayLayout';
import './forms/FormNestedDivider';
import './forms/FormSubmit';

import './forms/controls/Checkbox';
import './forms/controls/CheckboxGroup';
import './forms/controls/CountrySelect';
import './forms/controls/Date';
import './forms/controls/DateRdt';
import './forms/controls/DateTime';
import './forms/controls/DateTimeRdt';
import './forms/controls/Default';
import './forms/controls/Password';
export * from './forms/controls/Email';
import './forms/controls/Number';
import './forms/controls/PostalCode';
import './forms/controls/RadioGroup';
import './forms/controls/RegionSelect';
import './forms/controls/Select';
import './forms/controls/SelectMultiple';
import './forms/controls/StaticText';
import './forms/controls/Textarea';
import './forms/controls/Time';
import './forms/controls/TimeRdt';
export * from './forms/controls/Url';

import './theme/ThemeStyles';
import './theme/ThemeProvider';

import './ui/Alert';
import './ui/Button';
import './ui/Modal';
import './ui/ModalTrigger';
import './ui/Table';
import './ui/VerticalNavigation';

import './upload/UploadImage';
import './upload/UploadInner';

import './backoffice/BackofficeNavbar';
import './backoffice/BackofficePageLayout';
import './backoffice/BackofficeVerticalMenuLayout';

export * from './forms/controls/countries';

import { dynamicLoader, registerComponent } from 'meteor/vulcan:lib';

registerComponent('KeyEventHandler', dynamicLoader(() => import('./bonus/KeyEventHandler'), true));
