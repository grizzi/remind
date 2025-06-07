import { useField, useFormikContext } from 'formik'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

import { registerLocale } from 'react-datepicker'
import { de } from 'date-fns/locale/de'
import { input_style } from '../../shared/styles'
registerLocale('de-CH', de)

const DateField = (props: {
  label?: string
  id: string
  disabled?: boolean
}) => {
  const [field, meta] = useField(props.id)
  const { setFieldValue } = useFormikContext()

  const selectedDate = field.value ? new Date(field.value) : null

  return (
    <div className='flex flex-col w-full relative overflow-visible'>
      {props.label && (
        <label htmlFor={props.id} className='text-sm font-medium mb-1'>
          {props.label}
        </label>
      )}

      <DatePicker
        id={props.id}
        selected={selectedDate}
        onChange={(date: Date | null) => {
          setFieldValue(props.id, date ? date.toISOString().split('T')[0] : '')
        }}
        locale='de-CH'
        dateFormat='dd.MM.yyyy' // Swiss format
        className={`${input_style}`}
        disabled={props.disabled}
        placeholderText='Select a date'
      />

      <div className='min-h-[1.25rem] text-red-500 text-xs mt-1'>
        {meta.touched && meta.error && <span>{meta.error}</span>}
      </div>
    </div>
  )
}

export default DateField
