export interface ModifyOptions {
  /**
   * If set to `false`, the {@link EventRepository} will not emit events for the modified documents.
   *
   * @default true
   */
  emit?: boolean;
}
