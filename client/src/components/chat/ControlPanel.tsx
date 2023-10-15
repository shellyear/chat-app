import { Button } from 'react-bootstrap'
import styled from 'styled-components'

import SearchBar from '../common/SearchBar'

const Wrapper = styled.div`
  max-width: 40vw;
  min-width: 16rem;
  height: 100%;
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
`

const Header = styled.div`
  height: 3.5rem;
  padding: 0.375rem 0.8125rem 0.5rem 0.8125rem;
`

export function ControlPanel() {
  return (
    <Wrapper>
      <Container>
        <Header>
          <SearchBar />
        </Header>
        <Button>Verify Email</Button>
      </Container>
    </Wrapper>
  )
}
