import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { getUserDetails, updateUser } from '../actions/userActions'
import FormContainer from '../components/formContainer'
import { USER_UPDATE_RESET } from '../constants/userConstants'

const UserEditScreen = ({ match, history }) => {
    const userId = match.params.id
    const [email, setEmail] = useState('')
    const [isAdmin, setisAdmin] = useState(false)
    const [name, setName] = useState('')

    const dispatch = useDispatch()
    const userDetails = useSelector(state => state.userDetails)
    const { loading, error, user } = userDetails
    const userUpdate = useSelector(state => state.userUpdate)
    const { loading: loadingUpdate, error: errorUpdate, success: successUpdate } = userUpdate
    useEffect(() => {
        if (successUpdate) {
            dispatch({ type: USER_UPDATE_RESET })
            history.push('/admin/userList')
        } else {
            if (!user.name || user._id !== userId) {
                dispatch(getUserDetails(userId))
            } else {
                setName(user.name)
                setEmail(user.email)
                setisAdmin(user.isAdmin)
            }
        }


    }, [dispatch, user, userId, successUpdate, history])

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(updateUser({
            _id: user._id,
            name, email, isAdmin
        }))
    }
    return (
        <>
            <Link to='/admin/userList' className="btn btn-light my-3">
                Go Back
            </Link>
            <FormContainer>
                <h1>Edit</h1>
                {loadingUpdate && <Loader />}
                {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}
                {loading ? <Loader /> : error ? <Message variant="danger">{error}</Message> : (
                    <Form onSubmit={submitHandler}>
                        <Form.Group controlId='name'>
                            <Form.Label>Name</Form.Label>
                            <Form.Control type='name' placeholder="Enter Name" value={name} onChange={(e) => setName(e.target.value)}></Form.Control>
                        </Form.Group>
                        <Form.Group controlId='email'>
                            <Form.Label>Email</Form.Label>
                            <Form.Control type='email' placeholder="Enter Email" value={email} onChange={(e) => setEmail(e.target.value)}></Form.Control>
                        </Form.Group>
                        <Form.Group controlId='isAdmin'>
                            <Form.Check type='checkbox' label="Is Admin" checked={isAdmin} onChange={(e) => setisAdmin(e.target.checked)}></Form.Check>
                        </Form.Group>
                        <Button type="submit" variant="primary">Update</Button>
                    </Form>
                )}
            </FormContainer>
        </>
    )
}

export default UserEditScreen
