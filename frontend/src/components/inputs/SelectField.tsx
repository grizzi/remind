import { ErrorMessage, Field } from 'formik'

export type SelectOption = {
  value: string
  label: string
}

const SelectField = (props: {
  label: string
  id: string
  options: SelectOption[]
}) => {
  return (
    <div>
      <label htmlFor='name'>{props.label}</label>
      <div>
        <Field
          as='select'
          id={props.id}
          name={props.id}
          placeholder={props.label}
        >
          {props.options.map(opt => (
            <option value={opt.value}>{opt.label}</option>
          ))}
        </Field>
        <ErrorMessage name={props.id} />
      </div>
    </div>
  )
}

export default SelectField
