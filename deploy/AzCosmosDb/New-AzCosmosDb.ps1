<#
    .SYNOPSIS
	This script is used to deploy CosmosDB.

    .PARAMETER DeploymentSubscriptionId
    This parameter accepts the subscription ID where resources will be deployed.

    .PARAMETER DeploymentResourceGroupName
    This parameter accepts the name of the resource group where the resource would be provisioned in the provided subscription ID.

    .PARAMETER Region
    This parameter accepts the region where the resource would be deployed.

    .PARAMETER CosmosDbName
    The name of the Cosmos DB resource to be deployed.

    .PARAMETER CosmosDbApiType
    The API Type of the Cosmos DB. The template only accepts 2 API types i.e. MongoDB & SQL (GlobalDocumentDb)

    .PARAMETER CosmosDbOffer
    The offer/tier of the Cosmos DB resource to be deployed. As of now, only "Standard" is available.

	.DESCRIPTION
	The script will ask the user for various parameters and then depending on them, it will deploy the CosmosDB. It must be noted that the consistency level which has been setup for this deployment is "Strong"

    The script only supports deploying the CosmosDB resource with MongoDB API or the SQL (GlobalDocumentDB) API.

	The script does not support deployment of multiple CosmosDB Resources. If you would like to deploy multiple app service plans, run the script multiple times.

	.NOTES
		
		Author -- Pranav V Jituri (AIS)
        Last Revision -- 16th August 2018
        
#>
[CmdletBinding()]
param(
    [Parameter(Mandatory=$true)][string]$DeploymentSubscriptionId,
    [Parameter(Mandatory=$true)][string]$DeploymentResourceGroupName,
    [Parameter(Mandatory=$true)][string]$Region,
    [Parameter(Mandatory=$true)][string]$CosmosDbName,
    [Parameter(Mandatory=$true)][string]$CosmosDbApiType,
    [Parameter(Mandatory=$true)][string]$CosmosDbOffer
)

#Set ErrorAction to ensure that the script stops on error and not keep on proceeding ahead...
$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

function Start-AzCosmosDbDeployment{
    <#
    .SYNOPSIS
    This function serves as a wrapper to deploy a Cosmos DB Resource in an Azure Subscription
    
    .PARAMETER DeploymentSubscriptionId
    The Azure subscription Id where resource would be deployed.
    
    .PARAMETER DeploymentResourceGroupName
    The resource group name in which the Cosmos DB resource would be deployed
    
    .PARAMETER AzureCredentials
    A PSCredential object which contains the credentials to access the Azure subscription.
    
    .PARAMETER CosmosDbName
    Name of the Cosmos DB resource which would be deployed.
    
    .PARAMETER Region
    Region where the Cosmos DB resource would be deployed.
    
    .PARAMETER CosmosDbApiType
    The API Type of the Cosmos DB. The template only accepts 2 API types i.e. MongoDB & SQL (GlobalDocumentDb)
    
    .PARAMETER CosmosDbOffer
    The offer/tier of the Cosmos DB resource to be deployed. As of now, only "Standard" is available.
    
    .EXAMPLE
    Start-AzCosmosDbDeployment -DeploymentSubscriptionId "dc098fc9-yyyy-xxxx-aaaa-ab8900e01829" -DeploymentResourceGroupName "Fabrikam-ResourceGroup" -AzureCredentials $AzCreds -CosmosDbName "ContosoDb" -Region "eastus" -CosmosDbApiType "GlobalDocumentDb" -CosmosDbOffer "Standard"
    #>
[cmdletbinding()] 
param(
    [Parameter(Mandatory=$true)][string]$DeploymentSubscriptionId,
    [Parameter(Mandatory=$true)][string]$DeploymentResourceGroupName,
    [Parameter(Mandatory=$true)][pscredential]$AzureCredentials,
    [Parameter(Mandatory=$false)][string]$CosmosDbName,
    [Parameter(Mandatory=$true)][string]$Region,
    [Parameter(Mandatory=$true)][ValidateSet('GlobalDocumentDB','MongoDB',IgnoreCase=$false)][string]$CosmosDbApiType,
    [Parameter(Mandatory=$true)][string]$CosmosDbOffer
) 

Write-Verbose "[Start]:: Start-AzCosmosDbDeployment"

try{

    #Login to Azure and return Context. Azure subscription is hardcoded right now.
    Write-Verbose "[Info]:: Logging into Azure Subscription"
    $azureSubscriptionLogin = Login-AzureRmAccount -Credential $AzureCredentials -Subscription $DeploymentSubscriptionId -ErrorAction Stop
    Write-Verbose "[Info]:: Azure Subscription found -- "
    Write-Verbose ($azureSubscriptionLogin | Out-String)
    
    #Check if Resource Group in which deployment needs to take place exists or not.
    $azureResourceGroups = Get-AzureRmResourceGroup | Select-Object -Property 'ResourceGroupName' | Where-Object { $_.ResourceGroupName -eq $DeploymentResourceGroupName}
    if (!$azureResourceGroups) {
        throw "[Error]:: Unable to find resource group $DeploymentResourceGroupName for deployment. Ensure that application has been onboarded."
    } #end if
    Write-Verbose "[Info]:: Deployment Resource Group -- [$DeploymentResourceGroupName] -- found in Azure Subscription"

    #Construct the Template Parameter Object
    $cosmosDbTemplateParametersObject = @{
        "CosmosDbName" = $CosmosDbName.ToLower();
        "CosmosDbApiType" = $CosmosDbApiType;
        "Region" = $Region;
        "CosmosDbOffer" = $CosmosDbOffer;
    }
    Write-Verbose "[Info]:: ARM Template Deployment Parameters -- "
    Write-Verbose ($cosmosDbTemplateParametersObject | Out-String)

    #Deployment Name Generation.
    $cosmosDbTemplateDeploymentName = "Az-WebApp-" + (((Get-Date).ToUniversalTime()).ToString('MMddyyyy-HHmmss'))
    Write-Verbose "[Info]:: Azure Deployment Name Set as -- $cosmosDbTemplateDeploymentName"
    
    #Deploy-AzCosmosDbTemplate.
    Write-Verbose "[Info]:: Starting Azure Template Deployment"
    $cosmosDbDeployment = New-AzureRmResourceGroupDeployment -Name $cosmosDbTemplateDeploymentName `
                                        -ResourceGroupName $DeploymentResourceGroupName `
                                        -Mode "Incremental" `
                                        -TemplateFile "AzCosmosDb.Template.json" `
                                        -TemplateParameterObject $cosmosDbTemplateParametersObject `
                                        -Force -ErrorAction Stop -Verbose
    Write-Verbose "[Info]:: Azure Template Deployment Complete -- "
    Write-Verbose ($cosmosDbDeployment | Out-String)

} #end try
catch{
    Write-Warning -Message "Caught an exception:"
    Write-Warning -Message "Exception Type: $($_.Exception.GetType().FullName)"
    Write-Error -Message "Exception Message: $($_.Exception.Message)"
} #end catch
Write-Verbose "[End]:: Start-AzCosmosDbDeployment"
} #end function Start-AzCosmosDbDeployment

Start-AzCosmosDbDeployment -DeploymentSubscriptionId $DeploymentSubscriptionId `
                        -DeploymentResourceGroupName $DeploymentResourceGroupName `
                        -AzureCredentials (Get-Credential -Message "Please Enter your credentials to login to Azure Subscription") `
                        -CosmosDbName $CosmosDbName `
                        -CosmosDbApiType $CosmosDbApiType `
                        -CosmosDbOffer $CosmosDbOffer `
                        -Region $Region `
                        -Verbose