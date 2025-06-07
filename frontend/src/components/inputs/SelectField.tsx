import { ErrorMessage, Field } from 'formik'
import { input_style } from '../../shared/styles'

export type SelectOption = {
  value: string
  label: string
}

const SelectField = (props: {
  label?: string
  id: string
  options: SelectOption[]
  disabled?: boolean
}) => {
  return (
    <div className='flex flex-col w-full'>
      <div>
        {props.label ?? <label htmlFor={props.id}></label>}
        <Field
          as='select'
          id={props.id}
          name={props.id}
          disabled={props?.disabled}
          className={`${input_style}`}
        >
          {props.options.map(opt => (
            <option
              key={opt.value}
              value={opt.value}
              className='dark:bg-gray-800 dark:text-gray-200'
            >
              {opt.label}
            </option>
          ))}
        </Field>
        {/* Reserve space for error */}
        <div className='min-h-[1.25rem] text-red-500 text-xs mt-1'>
          <ErrorMessage name={props.id} />
        </div>
      </div>
    </div>
  )
}

export default SelectField
