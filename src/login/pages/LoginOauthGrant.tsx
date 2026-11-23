import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import { PageProps } from "keycloakify/login/pages/PageProps";
import { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { ActionList, ActionListGroup, ActionListItem, Button, Form, FormGroup, List, ListItem, Title } from "@patternfly/react-core";

export default function LoginOauthGrant(props: PageProps<Extract<KcContext, { pageId: "login-oauth-grant.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, classes, Template } = props;
    const { url, oauth, client } = kcContext;

    const { msg, msgStr, advancedMsg, advancedMsgStr } = i18n;

    const { kcClsx } = getKcClsx({
        doUseDefaultCss,
        classes
    });

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            bodyClassName="oauth"
            headerNode={
                <>
                    {client.attributes.logoUri && <img src={client.attributes.logoUri} />}
                    <p>{client.name ? msg("oauthGrantTitle", advancedMsgStr(client.name)) : msg("oauthGrantTitle", client.clientId)}</p>
                </>
            }
        >
            <div id="kc-oauth" className="content-area">
                <Title headingLevel="h3">{msg("oauthGrantRequest")}</Title>
                <List>
                    {oauth.clientScopesRequested.map(clientScope => (
                        <ListItem key={clientScope.consentScreenText}>
                            <span>
                                {advancedMsg(clientScope.consentScreenText)}
                                {clientScope.dynamicScopeParameter && (
                                    <>
                                        : <b>{clientScope.dynamicScopeParameter}</b>
                                    </>
                                )}
                            </span>
                        </ListItem>
                    ))}
                </List>

                {client.attributes.policyUri ||
                    (client.attributes.tosUri && (
                        <Title headingLevel="h3">
                            {client.name ? msg("oauthGrantInformation", advancedMsgStr(client.name)) : msg("oauthGrantInformation", client.clientId)}
                            {client.attributes.tosUri && (
                                <>
                                    {msg("oauthGrantReview")}
                                    <a href={client.attributes.tosUri} target="_blank">
                                        {msg("oauthGrantTos")}
                                    </a>
                                </>
                            )}
                            {client.attributes.policyUri && (
                                <>
                                    {msg("oauthGrantReview")}
                                    <a href={client.attributes.policyUri} target="_blank">
                                        {msg("oauthGrantPolicy")}
                                    </a>
                                </>
                            )}
                        </Title>
                    ))}

                <Form action={url.oauthAction} method="POST">
                    <input type="hidden" name="code" value={oauth.code} />
                    <FormGroup isActionGroup>
                        <div id="kc-form-options">
                            <div className={kcClsx("kcFormOptionsWrapperClass")}></div>
                        </div>

                        <ActionList>
                            <ActionListGroup>
                                <ActionListItem>
                                    <Button
                                        name="accept"
                                        id="kc-login"
                                        type="submit"
                                    >
                                        {msgStr("doYes")}
                                    </Button>
                                </ActionListItem>
                                <ActionListItem>
                                    <Button
                                        name="cancel"
                                        id="kc-cancel"
                                        type="submit"
                                    >
                                        {msgStr("doNo")}
                                    </Button>
                                </ActionListItem>
                            </ActionListGroup>
                        </ActionList>
                    </FormGroup>
                </Form>
                <div className="clearfix"></div>
            </div>
        </Template>
    );
}
