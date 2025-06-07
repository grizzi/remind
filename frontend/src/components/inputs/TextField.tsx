import { ErrorMessage, Field } from 'formik'
import { input_style } from '../../shared/styles'

const TextField = (props: {
  label?: string
  id: string
  disabled?: boolean
}) => {
  return (
    <div className='flex flex-col justify-start min-w-24'>
      {props.label && ( // Only render label if it exists
        <label
          htmlFor={props.id}
          className='mb-1 text-gray-700 dark:text-gray-300 text-sm font-medium'
        >
          {props.label}
        </label>
      )}
      <Field
        id={props.id}
        name={props.id}
        placeholder={props.label}
        disabled={props.disabled}
        className={`${input_style}`}
      />
      {/* Reserve space for error */}
      <div className='min-h-[1.25rem] text-red-500 text-xs mt-1 dark:text-red-400'>
        <ErrorMessage name={props.id} />
      </div>
    </div>
  )
}

export default TextField
