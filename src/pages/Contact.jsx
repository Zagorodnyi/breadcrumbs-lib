// src/pages/Contact.js
import React from 'react'
import Layout from '../components/Layout'
import { useBreadcrumbState, useBreadcrumbs, useNavigate } from '../breadcrumbs'

function Contact() {
  const { goToBreadcrumb } = useBreadcrumbs()
  const { navigateWithBreadcrumbs } = useNavigate()

  // Form state with breadcrumbs state preservation
  const [formState, setFormState] = useBreadcrumbState('formState', {
    name: '',
    email: '',
    message: '',
    submitted: false
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormState({
      ...formState,
      [name]: value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Simulate form submission
    setFormState({
      ...formState,
      submitted: true
    })

    // In a real app, you would call an API here
    console.log('Form submitted with:', formState)
  }

  const handleReset = () => {
    setFormState({
      name: '',
      email: '',
      message: '',
      submitted: false
    })
  }

  return (
    <Layout>
      <h2>Contact Us</h2>

      {formState.submitted ? (
        <div style={{ padding: '20px', backgroundColor: '#e6f7e6', marginBottom: '20px', borderRadius: '5px' }}>
          <h3>Thank you for your message!</h3>
          <p>We've received your submission and will get back to you soon.</p>
          <button onClick={handleReset} style={{ marginTop: '10px' }}>
            Send another message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ maxWidth: '500px' }}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Name:</label>
            <input
              type="text"
              name="name"
              data-testid="name-input"
              value={formState.name}
              onChange={handleInputChange}
              required
              style={{ width: '100%', padding: '8px' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
            <input
              type="email"
              name="email"
              data-testid="email-input"
              value={formState.email}
              onChange={handleInputChange}
              required
              style={{ width: '100%', padding: '8px' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Message:</label>
            <textarea
              name="message"
              value={formState.message}
              onChange={handleInputChange}
              required
              rows="5"
              style={{ width: '100%', padding: '8px' }}
            />
          </div>

          <div>
            <button type="submit" style={{ padding: '8px 15px', marginRight: '10px' }}>
              Submit
            </button>
            <button type="button" onClick={handleReset} style={{ padding: '8px 15px' }}>
              Reset Form
            </button>
          </div>
        </form>
      )}

      <div style={{ marginTop: '30px' }}>
        <button data-testid="go-back" onClick={() => goToBreadcrumb(-1)}>
          Go Back
        </button>

        <button data-testid="go-back-extra" onClick={() => goToBreadcrumb(-1, { extra: 'string' })}>
          Go Back with extra as string
        </button>

        <button data-testid="buttonLink-products" onClick={() => navigateWithBreadcrumbs('/products')}>
          Go to products
        </button>

        <p style={{ marginTop: '20px' }}>
          <strong>Note:</strong> Your form data will be preserved in the breadcrumbs state.
          If you navigate away and come back, your form data should still be here.
        </p>
      </div>
    </Layout>
  )
}

// Config for page
Contact.config = {
  url: '/contact',
  title: 'Contact Page'
}

export default Contact
