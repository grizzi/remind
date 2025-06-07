import { ErrorMessage, Field } from 'formik'
import { input_style } from '../../shared/styles'

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
        className={`${input_style}`}
      />
      {/* Reserve space for error */}
      <div className='min-h-[1.25rem] text-red-500 text-xs mt-1'>
        <ErrorMessage name={props.id} />
      </div>
    </div>
  )
}

export default NumericField
