import { z } from 'zod'
import { toFormikValidationSchema } from '../shared/zod_utilities'
import { Formik, ErrorMessage, Form, Field } from 'formik'

const RegisterFormSchema = z
  .object({
    name: z
      .string()
      .min(2, 'Name must be at least 2 characters long')
      .max(25, 'Name should be at most 25 characters long'),
    dateOfBirth: z.string(),
    email: z.string().email('Invalid email'),
    password: z
      .string()
      .min(8, 'Password should be at least 8 characters long')
      .max(16, 'Password should be at most 16 characters long'),
    repeatPassword: z.string(),
  })
  .refine(data => data.password === data.repeatPassword, {
    message: "Passwords don't match",
    path: ['repeatPassword'], // Path of the error
  })

const initialValues = {
  name: '',
  dateOfBirth: '',
  email: '',
  password: '',
  repeatPassword: '',
}

const InputField = (props: { label: string; id: string }) => {
  return (
    <div>
      <label htmlFor='name'>{props.label}</label>
      <Field id={props.id} name={props.id} placeholder={props.label} />
      <ErrorMessage name={props.id} />
    </div>
  )
}

const SubscriptionForm = () => {
  return (
    <div>
      <Formik
        initialValues={initialValues}
        onSubmit={(values, actions) => {
          alert(JSON.stringify(values))
          actions.setSubmitting(false);
        }}
        validationSchema={toFormikValidationSchema(RegisterFormSchema)}
      >
        <Form>
          <InputField id='name' label='First Name' />
          <InputField id='dateOfBirth' label='dateOfBirth' />
          <InputField id='email' label='email' />
          <InputField id='password' label='password' />
          <InputField id='repeatPassword' label='repeatPassword' />
          <button type='submit'>Submit</button>
        </Form>
      </Formik>
    </div>
  )
}

export default SubscriptionForm
