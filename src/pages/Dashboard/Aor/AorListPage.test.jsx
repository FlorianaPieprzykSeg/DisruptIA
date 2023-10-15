import {describe, test} from 'vitest';
import {render } from '@testing-library/react'
import AorListPage from './AorListPage';
import { MemoryRouter } from 'react-router-dom';
import { SnackbarProvider } from "notistack"

describe('AorEditPage', () => {
    test('renders', () => {
        
        render(
        <SnackbarProvider>
            <MemoryRouter>
                <AorListPage></AorListPage>
            </MemoryRouter>
        </SnackbarProvider>)

    })
})