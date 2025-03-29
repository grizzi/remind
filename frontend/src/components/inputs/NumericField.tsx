import { ErrorMessage, Field } from 'formik'

const NumericField = (props: {
  label?: string
  id: string
  disabled?: boolean
}) => {
  return (
    <div className='flex flex-col justify-start min-w-24'>
      {props.label ?? <label htmlFor={props.id}></label>}
      <Field
        id={props.id}
        name={props.id}
        type='number'
        placeholder={props.label}
        disabled={props.disabled}
        className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm'
      />
      {/* Reserve space for error */}
      <div className='min-h-[1.25rem] text-red-500 text-xs mt-1'>
        <ErrorMessage name={props.id} />
      </div>
    </div>
  )
}

export default NumericField
