import { ErrorMessage, Field } from 'formik'

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
          className='px-3 py-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm'
        >
          {props.options.map(opt => (
            <option key={opt.value} value={opt.value}>
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
