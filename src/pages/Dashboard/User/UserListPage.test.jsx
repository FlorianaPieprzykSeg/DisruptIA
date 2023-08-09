import {describe, test} from 'vitest';
import {render } from '@testing-library/react'
import UserListPage from './UserListPage';
import { MemoryRouter } from 'react-router-dom';
import { SnackbarProvider } from "notistack"

describe('UserEditPage', () => {
    test('renders', () => {
        
        render(
        <SnackbarProvider>
            <MemoryRouter>
                <UserListPage></UserListPage>
            </MemoryRouter>
        </SnackbarProvider>)

    })
})