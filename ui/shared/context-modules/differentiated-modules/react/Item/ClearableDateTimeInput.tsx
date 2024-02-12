/*
 * Copyright (C) 2023 - present Instructure, Inc.
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

import React from 'react'
import {DateTimeInput} from '@instructure/ui-date-time-input'
import {ScreenReaderContent} from '@instructure/ui-a11y-content'
import {CondensedButton} from '@instructure/ui-buttons'
import {Flex} from '@instructure/ui-flex'
import WithBreakpoints from '@canvas/with-breakpoints'
import {useScope as useI18nScope} from '@canvas/i18n'
import type {Breakpoints} from '@canvas/with-breakpoints'
import type {FormMessage} from '@instructure/ui-form-field'

const I18n = useI18nScope('differentiated_modules')

export interface ClearableDateTimeInputProps {
  description: string
  dateRenderLabel: string
  value: string | null
  messages: Array<FormMessage>
  onChange: (event: React.SyntheticEvent, value: string | undefined) => void
  onBlur?: (event: React.SyntheticEvent) => void
  onClear: () => void
  breakpoints: Breakpoints
  showMessages?: boolean
  locale?: string
  timezone?: string
  dateInputRef?: (el: HTMLInputElement | null) => void
}

function ClearableDateTimeInput({
  description,
  dateRenderLabel,
  value,
  messages,
  onChange,
  onBlur,
  onClear,
  breakpoints,
  showMessages,
  locale,
  timezone,
  dateInputRef,
}: ClearableDateTimeInputProps) {
  const determineHeight = () => {
    if (breakpoints?.mobileOnly) {
      return 'auto'
    } else if (messages.length > 0) {
      return '134px'
    } else {
      return '97px'
    }
  }

  return (
    <Flex
      data-testid="clearable-date-time-input"
      as="div"
      margin="small none"
      height={determineHeight()}
      direction={breakpoints?.mobileOnly ? 'column' : 'row'}
      alignItems={breakpoints?.mobileOnly ? undefined : 'center'}
    >
      <Flex.Item
        shouldShrink={true}
        overflowX="visible"
        overflowY="visible"
        align={breakpoints?.mobileOnly ? undefined : 'start'}
      >
        <DateTimeInput
          allowNonStepInput={true}
          colSpacing="small"
          dateFormat="MMM D, YYYY"
          description={<ScreenReaderContent>{description}</ScreenReaderContent>}
          dateRenderLabel={dateRenderLabel}
          timeRenderLabel={I18n.t('Time')}
          invalidDateTimeMessage={I18n.t('Invalid date')}
          prevMonthLabel={I18n.t('Previous month')}
          nextMonthLabel={I18n.t('Next month')}
          value={value ?? undefined}
          layout="columns"
          messages={messages}
          showMessages={showMessages}
          locale={locale}
          timezone={timezone}
          onChange={onChange}
          onBlur={onBlur}
          dateInputRef={dateInputRef}
        />
      </Flex.Item>
      <Flex.Item overflowX="visible" overflowY="visible">
        <CondensedButton
          onClick={onClear}
          margin={breakpoints?.mobileOnly ? 'small 0 0 0' : '0 0 0 small'}
        >
          {I18n.t('Clear')}
        </CondensedButton>
      </Flex.Item>
    </Flex>
  )
}

export default WithBreakpoints(ClearableDateTimeInput)
