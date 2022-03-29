DATE_PICKER_XPATH = '/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.DatePicker/';

export const YEAR_SELECT = DATE_PICKER_XPATH + 'android.widget.LinearLayout/android.widget.LinearLayout/android.widget.LinearLayout/android.widget.TextView[1]';
export const YEAR_SCROLL = DATE_PICKER_XPATH + 'android.widget.LinearLayout/android.widget.ScrollView';
export const getYearXpathWithOffset = offset => `${DATE_PICKER_XPATH}android.widget.LinearLayout/android.widget.ScrollView/android.widget.ViewAnimator/android.widget.ListView/android.widget.TextView[${offset + 1}]`;
export const getDateXpathWithOffset = offset => `${DATE_PICKER_XPATH}android.widget.LinearLayout/android.widget.ScrollView/android.widget.ViewAnimator/android.view.ViewGroup/com.android.internal.widget.ViewPager/android.view.View/android.view.View[${offset + 1}]`;
export const PREVIOUS_MONTH_BUTTON = '//android.widget.ImageButton[@content-desc="Previous month"]';
export const NEXT_MONTH_BUTTON = '//android.widget.ImageButton[@content-desc="Next month"]';
export const DATEPICKER_CONFIRM_BUTTON = '/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.ScrollView/android.widget.LinearLayout/android.widget.Button[2]';

export const getPickerItemXpathWithOffset = offset => `/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/androidx.appcompat.widget.LinearLayoutCompat/android.widget.FrameLayout/android.widget.ListView/android.widget.CheckedTextView[${offset + 1}]`

export const GENDER_PICKER_TEXT_XPATH = '//android.widget.Spinner[@content-desc="genderPicker"]/android.widget.TextView';
export const VACCINE_PICKER_TEXT_XPATH = '//android.widget.Spinner[@content-desc="vaccineTypePicker"]/android.widget.TextView';