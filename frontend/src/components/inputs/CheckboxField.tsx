import { ErrorMessage, Field } from 'formik'

const CheckboxField = (props: { label: string; id: string }) => {
  return (
    <div>
      <label htmlFor={props.id}>{props.label}</label>
      <div>
        <Field id={props.id} name={props.id} placeholder={props.label} type="checkbox"/>
        <ErrorMessage name={props.id} />
      </div>
    </div>
  )
}

export default CheckboxField
