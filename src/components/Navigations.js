import React from 'react'
import styled from 'styled-components'

const NavigationLayout = styled.footer`
  .navigation {
    display: flex;
    justify-content: center;
    list-style: none;
    padding: 0;
    margin: 0;
    height: 10vh;
    max-height: 100px;
    font-size: 1.25em;
  }

  .navigationItem {
    display: inline-flex;
    align-items: center;
    margin: 0 1rem;
  }

  .navigationItem a {
    color: currentColor;
  }
`

export default () => (
    <NavigationLayout>
      <ul className="navigation">
        <li className="navigationItem">
          <a href="/">Home</a>
        </li>
        <li className="navigationItem">
          <a href="/blog/">Published</a>
        </li>
      </ul>
    </NavigationLayout>
  )
