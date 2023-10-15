import {describe, test} from 'vitest';
import {render} from '@testing-library/react'
import DatabaseCreatePage from './DatabaseCreatePage';
import { MemoryRouter } from 'react-router-dom';
import { SnackbarProvider } from "notistack"

describe('DatabaseCreatePage', () => {
    test('renders', () => {
        
        render(
        <SnackbarProvider>
            <MemoryRouter>
                <DatabaseCreatePage></DatabaseCreatePage>
            </MemoryRouter>
        </SnackbarProvider>)
    })
})