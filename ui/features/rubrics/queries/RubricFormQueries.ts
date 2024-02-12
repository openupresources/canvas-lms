/*
 * Copyright (C) 2024 - present Instructure, Inc.
 *
 * This file is part of Canvas.
 *
 * Canvas is free software: you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License as published by the Free
 * Software Foundation, version 3 of the License.
 *
 * Canvas is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 * A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License along
 * with this program. If not, see <http://www.gnu.org/licenses/>.
 */

import gql from 'graphql-tag'
import qs from 'qs'
import {executeQuery} from '@canvas/query/graphql'
import type {RubricFormProps} from '../types/RubricForm'
import type {Rubric} from '@canvas/rubrics/react/types/rubric'
import getCookie from '@instructure/get-cookie'

const RUBRIC_QUERY = gql`
  query RubricQuery($id: ID!) {
    rubric(id: $id) {
      id: _id
      title
      hidePoints
      workflowState
      pointsPossible
      criteria {
        id: _id
        ratings {
          description
          longDescription
          points
        }
        points
        longDescription
        description
      }
    }
  }
`

export type RubricQueryResponse = Pick<
  Rubric,
  'id' | 'title' | 'criteria' | 'hidePoints' | 'pointsPossible'
>

type FetchRubricResponse = {
  rubric: RubricQueryResponse
}

export const fetchRubric = async (id?: string): Promise<RubricQueryResponse | null> => {
  if (!id) return null

  const {rubric} = await executeQuery<FetchRubricResponse>(RUBRIC_QUERY, {
    id,
  })
  return rubric
}

export const saveRubric = async (rubric: RubricFormProps): Promise<RubricQueryResponse> => {
  const {id, title, hidePoints, accountId, courseId} = rubric
  const urlPrefix = accountId ? `/accounts/${accountId}` : `/courses/${courseId}`
  const url = `${urlPrefix}/rubrics/${id ?? ''}`
  const method = id ? 'PATCH' : 'POST'

  const criteria = rubric.criteria.map(criterion => {
    return {
      id: criterion.id,
      description: criterion.description,
      long_description: criterion.longDescription,
      points: criterion.points,
      learning_outcome_id: criterion.learningOutcomeId,
      ratings: criterion.ratings.map(rating => ({
        description: rating.description,
        long_description: rating.longDescription,
        points: rating.points,
        id: rating.id,
      })),
    }
  })

  const response = await fetch(url, {
    method,
    headers: {
      'X-CSRF-Token': getCookie('_csrf_token'),
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    },
    body: qs.stringify({
      _method: method,
      rubric: {
        title,
        hide_points: hidePoints,
        criteria,
      },
      rubric_association: {
        association_id: accountId ?? courseId,
        association_type: accountId ? 'Account' : 'Course',
      },
    }),
  })

  if (!response.ok) {
    throw new Error(`Failed to save rubric: ${response.statusText}`)
  }

  const {rubric: savedRubric, error} = await response.json()

  if (error) {
    throw new Error(`Failed to save rubric`)
  }

  return {
    id: savedRubric.id,
    title: savedRubric.title,
    hidePoints: savedRubric.hide_points,
    criteria: savedRubric.criteria,
    pointsPossible: savedRubric.points_possible,
  }
}
