import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { CircularProgress } from '@mui/material';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { getOperator } from "../../api/operator";
import { setupFirebase } from "../../config/firebase";
import { getActiveUser } from "../../config/user";


setupFirebase();
const auth = getAuth();

function SignInPage() {
    const navigate = useNavigate();
    const activeUser = getActiveUser();

    const [errorMessage, setErrorMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    const onFetchFirebaseUser = async (firebaseUserUid) => {
        const operator = await getOperator(firebaseUserUid);
        if (operator) {
            localStorage.setItem('user', JSON.stringify(operator));
            navigate("/home", { replace: true });
        }
        else setErrorMessage("User with provided firebase UID does not exist in database");
    };

    if (activeUser) onFetchFirebaseUser(activeUser?.firebase_uid); // Already signed in

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrorMessage(null);
        setLoading(true);
        const data = new FormData(event.currentTarget);
        const email = data.get("email");
        const password = data.get("password");
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const firebaseUser = userCredential.user;
            await onFetchFirebaseUser(firebaseUser.uid);
        }
        catch (error) {
            const errorCode = error?.code;
            const errorMessage = error?.message;
            switch (errorCode) {
                case "auth/user-not-found":
                    setErrorMessage("No account exists for this email address");
                    break;
                case "auth/wrong-password":
                    setErrorMessage("Wrong email/password combination");
                    break;
                default:
                    setErrorMessage(errorCode + ": " + errorMessage);
            }
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <Grid container component="main" sx={{ height: '100vh' }}>
            <Grid
                item
                xs={false}
                sm={4}
                md={7}
                sx={{
                    backgroundImage: 'url(https://source.unsplash.com/random)',
                    backgroundRepeat: 'no-repeat',
                    backgroundColor: (t) =>
                        t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            />
            <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                <Box
                    sx={{
                        my: 8,
                        mx: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={loading}
                            sx={{ mt: 3, mb: 4 }}
                        >
                            {
                                loading ?
                                    <CircularProgress color='primary' />
                                    : <span>Sign In</span>
                            }
                        </Button>
                        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
                    </Box>
                </Box>
            </Grid>
        </Grid>
    );
}

export default SignInPage;
