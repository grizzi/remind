import { ErrorMessage, Field } from 'formik'

const TextField = (props: { label: string; id: string }) => {
  return (
    <div className='mb-4'>
      <label
        htmlFor={props.id}
        className='block text-sm font-medium text-gray-700 mb-1'
      >
        {props.label}
      </label>
      <div>
        <Field
          id={props.id}
          name={props.id}
          placeholder={props.label}
          className='w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
        />
        <ErrorMessage
          name={props.id}
          component='div'
          className='text-red-500 text-sm mt-1'
        />
      </div>
    </div>
  )
}

export default TextField
