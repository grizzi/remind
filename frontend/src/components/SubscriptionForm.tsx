import { Button, TextField, Typography } from '@mui/material'
import { useFormik, FormikErrors } from 'formik'
import { z } from 'zod'

// See https://github.com/Glazy/formik-validator-zod/blob/main/lib/index.ts
// export const withZodSchema =
//   <T>(schema: ZodSchema<T>, params?: Partial<ParseParams>) =>
//   (values: T): Partial<T> => {
//     const result = schema.safeParse(values, params)

//     if (result.success) return {}

//     return result.error.issues.reduce((acc, curr) => {
//       return merge(
//         acc,
//         curr.path.reduceRight(
//           (errors, pathSegment) => ({
//             [pathSegment]: !Object.keys(errors).length ? curr.message : errors,
//           }),
//           {}
//         )
//       )
//     }, {})
//   }

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

type RegisterFormSchemaType = z.infer<typeof RegisterFormSchema>

const validate = (values: RegisterFormSchemaType) => {
  const validation = RegisterFormSchema.safeParse(values)
  alert(`Validation error from zod: ${JSON.stringify(validation.error)}`)

  let errors: FormikErrors<RegisterFormSchemaType> = {}

  if (!values.name) {
    errors.name = 'Required'
  } else if (values.name.length > 15) {
    errors.name = 'Must be 15 characters or less'
  }

  if (!values.email) {
    errors.email = 'Required'
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'Invalid email address'
  }

  return errors
}

const SubscriptionForm = () => {
  const formik = useFormik<RegisterFormSchemaType>({
    initialValues: {
      name: '',
      dateOfBirth: '',
      email: '',
      password: '',
      repeatPassword: '',
    },
    onSubmit: values => {
      alert(JSON.stringify(values))
    },
    validate: validate,
  })
  console.log(
    `Values : ${JSON.stringify(formik.values)}\n\nerrors : ${JSON.stringify(
      formik.errors,
    )}\n\n`,
  )
  return (
    <section>
      <form onSubmit={formik.handleSubmit}>
        <Typography variant='h6'>Sign up</Typography>
        <TextField
          id='name'
          type='text'
          label='Name'
          placeholder='Name'
          fullWidth
          {...formik.getFieldProps('name')}
        />
        {formik.errors.name && formik.touched.name && (
          <div>{formik.errors.name}</div>
        )}
        <TextField
          id='dateOfBirth'
          type='date'
          label='Date of Birth'
          fullWidth
          {...formik.getFieldProps('dateOfBirth')}
        />
        {formik.errors.dateOfBirth && formik.touched.dateOfBirth && (
          <div>{formik.errors.dateOfBirth}</div>
        )}
        <TextField
          id='email'
          type='email'
          label='Email'
          placeholder='johndoe@example.com'
          fullWidth
          {...formik.getFieldProps('email')}
        />
        {formik.errors.email && formik.touched.email && (
          <div>{formik.errors.email}</div>
        )}
        <TextField
          id='password'
          type='password'
          label='Password'
          placeholder='Password'
          fullWidth
          {...formik.getFieldProps('password')}
        />
        {formik.errors.password && formik.touched.password && (
          <div>{formik.errors.password}</div>
        )}
        <TextField
          id='repeatPassword'
          type='password'
          label='Repeat password'
          placeholder='Repeat password'
          fullWidth
          {...formik.getFieldProps('repeatPassword')}
        />
        {formik.errors.repeatPassword && formik.touched.repeatPassword && (
          <div>{formik.errors.repeatPassword}</div>
        )}
        <Button variant='contained' type='submit' fullWidth>
          Submit
        </Button>
      </form>
    </section>
  )
}

export default SubscriptionForm
