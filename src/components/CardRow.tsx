import React, { useMemo, useEffect, useRef } from 'react'
import { CardRow as CardRowStyled, CardCount } from './CardRow.styles'

interface Props {
  visibleRounds: number
}

const rounds = [7, 6, 5, 4, 3, 2, 1, 2, 3, 4, 5, 6, 7]

export const CardRow = (props: Props) => {
  const lastRef = useRef<HTMLDivElement>(null)
  const visible = useMemo(() => {
    return rounds.slice(0, props.visibleRounds).map((round, idx) => {
      return (
        <CardCount
          key={idx}
          ref={idx === props.visibleRounds - 1 ? lastRef : null}
        >
          {round}
        </CardCount>
      )
    })
  }, [props.visibleRounds, lastRef])

  useEffect(() => {
    if (lastRef && lastRef.current) {
      lastRef.current.scrollIntoView()
    }
  }, [lastRef, props.visibleRounds])

  return <CardRowStyled id="CardRow">{visible}</CardRowStyled>
}
