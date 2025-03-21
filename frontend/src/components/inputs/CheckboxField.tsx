import { ErrorMessage, Field, useField } from 'formik'

const CheckboxField = (props: { label: string; id: string }) => {
  const [field] = useField({ name: props.id, type: 'checkbox' })

  return (
    <div>
      <label
        htmlFor={props.id}
        className={`cursor-pointer inline-block px-4 py-2 rounded-full border transition 
          ${
            field.checked
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-gray-700 border-gray-300'
          } 
          hover:shadow-md`}
      >
        <input {...field} id={props.id} type='checkbox' className='hidden' />
        {props.label}
      </label>
      <div className='text-red-500 text-sm mt-1'>
        <ErrorMessage name={props.id} />
      </div>
    </div>
  )
}

export default CheckboxField
