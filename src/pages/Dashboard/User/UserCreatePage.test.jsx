import {describe, test} from 'vitest';
import {render} from '@testing-library/react'
import UserCreatePage from './UserCreatePage';
import { MemoryRouter } from 'react-router-dom';
import { SnackbarProvider } from "notistack"

describe('UserCreatePage', () => {
    test('renders', () => {
        
        render(
        <SnackbarProvider>
            <MemoryRouter>
                <UserCreatePage></UserCreatePage>
            </MemoryRouter>
        </SnackbarProvider>)
    })
})