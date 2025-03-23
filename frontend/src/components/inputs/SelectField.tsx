import { ErrorMessage, Field } from 'formik'

export type SelectOption = {
  value: string
  label: string
}

const SelectField = (props: {
  label: string
  id: string
  options: SelectOption[]
  disabled?: boolean
}) => {
  return (
    <div className='mb-4  mr-2 ml-2'>
      <label
        htmlFor={props.id}
        className='block text-sm min-w-40 font-medium text-gray-700 mb-1'
      >
        {props.label}
      </label>
      <div>
        <Field
          as='select'
          id={props.id}
          name={props.id}
          disabled={props?.disabled}
          className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
        >
          <option value='' disabled>
            {`Select ${props.label.toLowerCase()}`}
          </option>
          {props.options.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Field>
        <ErrorMessage
          name={props.id}
          component='div'
          className='mt-1 text-sm text-red-600'
        />
      </div>
    </div>
  )
}

export default SelectField
