import {describe, test} from 'vitest';
import {render } from '@testing-library/react'
import AorEditPage from './AorEditPage';
import { MemoryRouter } from 'react-router-dom';
import { SnackbarProvider } from "notistack"

describe('AorEditPage', () => {
    test('renders', () => {
        
        render(
        <SnackbarProvider>
            <MemoryRouter>
                <AorEditPage></AorEditPage>
            </MemoryRouter>
        </SnackbarProvider>)
    })
})