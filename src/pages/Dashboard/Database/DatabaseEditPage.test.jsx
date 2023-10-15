import {describe, test} from 'vitest';
import {render } from '@testing-library/react'
import DatabaseEditPage from './DatabaseEditPage';
import { MemoryRouter } from 'react-router-dom';
import { SnackbarProvider } from "notistack"

describe('DatabaseEditPage', () => {
    test('renders', () => {
        
        render(
        <SnackbarProvider>
            <MemoryRouter>
                <DatabaseEditPage></DatabaseEditPage>
            </MemoryRouter>
        </SnackbarProvider>)
    })
})