import {describe, test} from 'vitest';
import {render } from '@testing-library/react'
import DatabaseListPage from './DatabaseListPage';
import { MemoryRouter } from 'react-router-dom';
import { SnackbarProvider } from "notistack"

describe('DatabaseEditPage', () => {
    test('renders', () => {
        
        render(
        <SnackbarProvider>
            <MemoryRouter>
                <DatabaseListPage></DatabaseListPage>
            </MemoryRouter>
        </SnackbarProvider>)

    })
})