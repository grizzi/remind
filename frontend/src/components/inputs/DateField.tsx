import { ErrorMessage, Field } from 'formik'

const DateField = (props: { label: string; id: string; disabled?: boolean}) => {
  return (
    <div className='mb-4  mr-2 ml-2'>
      <label
        htmlFor={props.id}
        className='block text-sm font-medium text-gray-700 mb-1'
      >
        {props.label}
      </label>
      <div>
        <Field
          id={props.id}
          name={props.id}
          type='date'
          disabled={props?.disabled}
          placeholder={props.label}
          className='w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
        />
        <ErrorMessage
          name={props.id}
          component='div'
          className='text-red-500 text-sm mt-1'
        />
      </div>
    </div>
  )
}

export default DateField
