import { Button } from 'react-bootstrap'
import styled from 'styled-components'
import { signOut } from 'firebase/auth'
import { Link } from 'react-router-dom'

import SearchBar, { useSearchBar } from '../common/SearchBar'
import { auth } from '../../firebase'

const Wrapper = styled.div`
  max-width: 40vw;
  min-width: 16rem;
  height: 100%;
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const Header = styled.div`
  display: flex;
  gap: 1rem;
  height: 3.5rem;
  padding: 0.375rem 0.8125rem 0.5rem 0.8125rem;
`

const onSignOut = () => {
  signOut(auth).then(() => {
    // eslint-disable-next-line no-console
    console.log('Successfully signed out')
  })
}

export function ControlPanel() {
  const { onBlur, isFocused, ...searchBarData } = useSearchBar()

  return (
    <Wrapper>
      <Container>
        <Header>
          <button type="button" onClick={onBlur}>
            back
          </button>
          <SearchBar {...searchBarData} />
        </Header>
        {isFocused ? (
          <div>
            Users:
            {searchBarData.data &&
              searchBarData?.data.map((user) => (
                <Link key={user.email} to={`/${user.email}`}>
                  {user.email}
                </Link>
              ))}
          </div>
        ) : (
          <>
            <Button>Verify Email</Button>
            <Button onClick={onSignOut}>Sign out</Button>
          </>
        )}
      </Container>
    </Wrapper>
  )
}
