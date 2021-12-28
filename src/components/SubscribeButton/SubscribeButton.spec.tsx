import { render, screen, fireEvent } from '@testing-library/react'
import { mocked } from 'jest-mock'
import { useSession, signIn } from 'next-auth/client'
import { useRouter } from 'next/router'
import { SubscribeButton } from '.'

jest.mock('next-auth/client')

jest.mock('next/router' )

describe('SubscribeButton component', () => {
  it('renders correctly', () => {
    const useSessionMocked = mocked(useSession)

    useSessionMocked.mockReturnValueOnce([null, false])

    render(
      <SubscribeButton/>
    )
  
    expect(screen.getByText('Subscribe now')).toBeInTheDocument()
  })

  it('redirects user to sign in when not authenticated', () => {
    const singInMocked = mocked(signIn)
    const useSessionMocked = mocked(useSession)

    useSessionMocked.mockReturnValueOnce([null, false])

    render(<SubscribeButton />)

    const subscribebutton = screen.getByText('Subscribe now')

    fireEvent.click(subscribebutton);

    expect(singInMocked).toHaveBeenCalled()
  })

  it('redirects to post when user already has a subscription', () => {
    const useRouterMocked = mocked(useRouter)
    const useSessionMocked = mocked(useSession)
    const pushMock = jest.fn()

  useSessionMocked.mockReturnValueOnce([
      { 
        user: { 
          name: 'Jhon Doe', 
          email: 'jhondoe@a.com'
        }, 
        expires: 'fake',
        activeSubscription: 'fake-active'
      },
      false])


    useRouterMocked.mockReturnValueOnce({
      push: pushMock
    } as any)

    render(
      <SubscribeButton/>
    )

    const subscribebutton = screen.getByText('Subscribe now')

    fireEvent.click(subscribebutton);

    expect(pushMock).toHaveBeenCalledWith('/posts')
  })
})