<#
    .SYNOPSIS
	This script is used to deploy a v2 Storage Account. If you want to deploy multiple st

    .PARAMETER DeploymentSubscriptionId
    This parameter accepts the subscription ID where resources will be deployed.

    .PARAMETER DeploymentResourceGroupName
    This parameter accepts the name of the resource group where the resource would be provisioned in the provided subscription ID.

    .PARAMETER Region
    This parameter accepts the region where the resource would be deployed.

    .PARAMETER StorageAccountName
    The name of the Storage Account resource to be deployed.

    .PARAMETER StorageType
    The type of the Storage Account. The template accepts (case sensitive) - Standard_LRS, Standard_ZRS, Standard_GRS, Standard_RAGRS, Premium_LRS

    .PARAMETER StorageAccessType
    The access type of the Storage Account. The template accepts (case sensitive) - Cool,Hot

	.DESCRIPTION
	The script will ask the user for various parameters and then depending on them, it will deploy the Storage Account.

	.NOTES
		
		Author -- Pranav V Jituri (AIS)
        Last Revision -- 16th August 2018
        
#>
[CmdletBinding()]
param(
    [Parameter(Mandatory=$true)][string]$DeploymentSubscriptionId,
    [Parameter(Mandatory=$true)][string]$DeploymentResourceGroupName,
    [Parameter(Mandatory=$true)][string]$Region,
    [Parameter(Mandatory=$true)][string]$StorageAccountName,
    [Parameter(Mandatory=$true)][string]$StorageType,
    [Parameter(Mandatory=$true)][string]$StorageAccessType
)

#Set ErrorAction to ensure that the script stops on error and not keep on proceeding ahead...
$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

function Start-AzStorageAccountDeployment{
    <#
    .SYNOPSIS
    This function serves as a wrapper to deploy a Storage Account Resource in an Azure Subscription
    
    .PARAMETER DeploymentSubscriptionId
    The Azure subscription Id where resource would be deployed.
    
    .PARAMETER DeploymentResourceGroupName
    The resource group name in which the storage account resource would be deployed
    
    .PARAMETER AzureCredentials
    A PSCredential object which contains the credentials to access the Azure subscription.
    
    .PARAMETER StorageAccountName
    Name of the Storage Account resource which would be deployed.
    
    .PARAMETER Region
    Region where the Storage Account resource would be deployed.
    
    .PARAMETER StorageType
    The type of the Storage Account. The template accepts (case sensitive) - Standard_LRS, Standard_ZRS, Standard_GRS, Standard_RAGRS, Premium_LRS
    
    .PARAMETER StorageAccessType
    The script will ask the user for various parameters and then depending on them, it will deploy the Storage Account.
    
    .EXAMPLE
    Start-AzCosmosDbDeployment -DeploymentSubscriptionId "dc098fc9-yyyy-xxxx-aaaa-ab8900e01829" -DeploymentResourceGroupName "Fabrikam-ResourceGroup" -AzureCredentials $AzCreds -CosmosDbName "ContosoDb" -Region "eastus" -CosmosDbApiType "GlobalDocumentDb" -CosmosDbOffer "Standard"
    #>
[cmdletbinding()] 
param(
    [Parameter(Mandatory=$true)][string]$DeploymentSubscriptionId,
    [Parameter(Mandatory=$true)][string]$DeploymentResourceGroupName,
    [Parameter(Mandatory=$true)][pscredential]$AzureCredentials,
    [Parameter(Mandatory=$false)][string]$StorageAccountName,
    [Parameter(Mandatory=$true)][string]$Region,
    [Parameter(Mandatory=$true)][ValidateSet("Standard_LRS", "Standard_ZRS", "Standard_GRS", "Standard_RAGRS", "Premium_LRS",IgnoreCase=$false)][string]$StorageType,
    [Parameter(Mandatory=$true)][ValidateSet("Hot","Cool",IgnoreCase=$false)][string]$StorageAccessType
) 

Write-Verbose "[Start]:: Start-AzStorageAccountDeployment"

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
    $storageAccountTemplateParametersObject = @{
        "StorageAccountName" = $StorageAccountName.ToLower();
        "StorageType" = $StorageType;
        "Region" = $Region;
        "StorageAccessType" = $StorageAccessType;
    }
    Write-Verbose "[Info]:: ARM Template Deployment Parameters -- "
    Write-Verbose ($storageAccountTemplateParametersObject | Out-String)

    #Deployment Name Generation.
    $storageAccountTemplateDeploymentName = "Az-StorageAccount-" + (((Get-Date).ToUniversalTime()).ToString('MMddyyyy-HHmmss'))
    Write-Verbose "[Info]:: Azure Deployment Name Set as -- $storageAccountTemplateDeploymentName"
    
    #Deploy-AzCosmosDbTemplate.
    Write-Verbose "[Info]:: Starting Azure Template Deployment"
    $storageAccountDeployment = New-AzureRmResourceGroupDeployment -Name $storageAccountTemplateDeploymentName `
                                        -ResourceGroupName $DeploymentResourceGroupName `
                                        -Mode "Incremental" `
                                        -TemplateFile "AzStorageAccount.Template.json" `
                                        -TemplateParameterObject $storageAccountTemplateParametersObject `
                                        -Force -ErrorAction Stop -Verbose
    Write-Verbose "[Info]:: Azure Template Deployment Complete -- "
    Write-Verbose ($storageAccountDeployment | Out-String)

} #end try
catch{
    Write-Warning -Message "Caught an exception:"
    Write-Warning -Message "Exception Type: $($_.Exception.GetType().FullName)"
    Write-Error -Message "Exception Message: $($_.Exception.Message)"
} #end catch
Write-Verbose "[End]:: Start-AzCosmosDbDeployment"
} #end function Start-AzCosmosDbDeployment

Start-AzStorageAccountDeployment -DeploymentSubscriptionId $DeploymentSubscriptionId `
                        -DeploymentResourceGroupName $DeploymentResourceGroupName `
                        -AzureCredentials (Get-Credential -Message "Please Enter your credentials to login to Azure Subscription") `
                        -StorageAccountName $StorageAccountName `
                        -StorageType $StorageType `
                        -StorageAccessType $StorageAccessType `
                        -Region $Region `
                        -Verbose