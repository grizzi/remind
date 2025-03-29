import { useField, useFormikContext } from 'formik'

const formatDateToInput = (date: Date | string | null) => {
  if (!date) return ''
  if (typeof date === 'string') return date
  return date.toISOString().split('T')[0] // "YYYY-MM-DD"
}


const DateField = (props: {
  label?: string
  id: string
  disabled?: boolean
}) => {
  const [field, meta] = useField(props.id)
  const { setFieldValue } = useFormikContext()

  const valueAsString = formatDateToInput(field.value)

  return (
    <div className='flex flex-col w-full'>
      <input
        id={props.id}
        name={props.id}
        type='date'
        disabled={props.disabled}
        value={valueAsString}
        onChange={e => {
          setFieldValue(props.id, e.target.value)
        }}
        placeholder={props?.label}
        className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm'
      />
      <div className='min-h-[1.25rem] text-red-500 text-xs mt-1'>
        {meta.touched && meta.error && <span>{meta.error}</span>}
      </div>
    </div>
  )
}

export default DateField
